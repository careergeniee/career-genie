"""
app.py  (v2 - hardened)
=======================
FastAPI service that serves calibrated career predictions.

Run locally:
    pip install -r requirements.txt
    python train.py            # creates career_model.pkl (run once)
    uvicorn app:app --reload --port 8000

Endpoints:
    GET  /health   -> liveness + model version/algorithm/accuracy
    GET  /meta     -> feature order, labels, full algorithm comparison
    POST /predict  -> ranked predictions + calibrated probabilities + confidence
                       + a per-prediction feature-contribution breakdown
                       (auth required -- see auth.py)

Reliability features:
    * Strict input validation (feature values clamped to [0,1]; missing/NaN/inf
      values are coerced to 0 rather than rejected, so malformed input never
      crashes the service or 4xx's a real user mid-assessment).
    * Model loaded once and cached; clear 503 from every endpoint if it is missing.
    * Confidence signal (margin between top-2) and an `uncertain` flag so the
      UI can warn when a prediction is a close call.
    * Works whether the saved model is a plain Pipeline or a CalibratedClassifierCV.

Security:
    * /predict requires a valid Firebase ID token (Authorization: Bearer <token>),
      verified in auth.py -- the same guarantee the Vercel Groq proxy enforces.
      /health and /meta stay open (no user data, needed for uptime checks and
      the frontend's cold-start "warm the service" ping).
"""

from __future__ import annotations
import json, math, os, logging, threading
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from career_data import FEATURE_ORDER, CAREER_LABELS
from auth import require_user, AuthError

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("career-genie")

HERE = os.path.dirname(__file__)
MODEL_PATH = os.path.join(HERE, "career_model.pkl")
META_PATH = os.path.join(HERE, "model_meta.json")

# In production replace ["*"] with your real frontend origin(s).
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app = FastAPI(title="Career Genie ML Service", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

_model = None
_meta: dict = {}
# FastAPI runs sync `def` endpoints in a threadpool, so two requests can hit
# get_model() concurrently on a cold start. Without a lock, one request can
# see _model already set by the other while _meta is still being assigned a
# few lines later, momentarily serving a real model paired with an empty/stale
# meta dict (wrong model_version/algorithm in the response).
_model_lock = threading.Lock()


def get_model():
    global _model, _meta
    if _model is None:
        with _model_lock:
            if _model is None:  # re-check: another thread may have loaded it while we waited
                if not os.path.exists(MODEL_PATH):
                    raise FileNotFoundError("career_model.pkl not found. Run `python train.py` first.")
                loaded_meta = {}
                if os.path.exists(META_PATH):
                    with open(META_PATH) as fh:
                        loaded_meta = json.load(fh)
                _model = joblib.load(MODEL_PATH)
                _meta = loaded_meta
                log.info("Model loaded: %s v%s",
                         _meta.get("chosen_algorithm", "?"), _meta.get("model_version", "?"))
    return _model


def require_model():
    """FastAPI dependency: get_model(), or a clean 503 -- shared by every
    endpoint so a missing/corrupt model produces the same response everywhere
    instead of /health and /predict 503'ing while /meta 500's."""
    try:
        return get_model()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc))


def explain_top_class(
    model, vec: np.ndarray, idx: int, base: float, top_n: int = 5
) -> list[dict] | None:
    """
    Per-prediction feature contributions toward the class at `idx`, ranked by
    |contribution| descending. Model-agnostic: zero out one feature at a time
    (as a single batched predict_proba call) and measure how much P(class)
    drops from `base` (the caller's already-computed P(class) for the full
    vector -- passed in rather than recomputed here, since predict() already
    has it). Positive contribution = the feature pushes toward the predicted
    career. Returns None (never raises) -- explainability is a nice-to-have
    and must never break the prediction.

    (This used to try a SHAP TreeExplainer first. Dropped: the deployed
    model is a multiclass GradientBoostingClassifier, which SHAP's
    TreeExplainer rejects outright, so that path always failed and its
    only real effect was importing SHAP's whole toolchain on every cold
    start for nothing. This ablation method was already the fallback for
    every real request.)
    """
    try:
        n = vec.shape[1]
        batch = np.repeat(vec, n, axis=0)
        for i in range(n):
            batch[i, i] = 0.0
        probs = model.predict_proba(batch)[:, idx]
        contribs = base - probs
        ranked = sorted(zip(FEATURE_ORDER, contribs), key=lambda t: -abs(t[1]))
        return [{"feature": f, "contribution": round(float(c), 4)} for f, c in ranked[:top_n]]
    except Exception as exc:
        log.warning("Ablation explanation failed, omitting it from the response: %s", exc)
        return None


def verify_auth(authorization: str | None = Header(None)) -> str:
    """FastAPI dependency: requires a valid Firebase ID token, returns the caller's uid."""
    try:
        return require_user(authorization)
    except AuthError as exc:
        raise HTTPException(status_code=401, detail=str(exc))


class PredictRequest(BaseModel):
    features: dict[str, float] = Field(..., description="feature_name -> value in [0,1]")
    top_k: int = Field(5, ge=1, le=10)

    @field_validator("features")
    @classmethod
    def _check_features(cls, v: dict[str, float]) -> dict[str, float]:
        if not v:
            raise ValueError("features must not be empty")
        return v


class Prediction(BaseModel):
    career: str
    probability: float


class FeatureContribution(BaseModel):
    feature: str
    contribution: float        # signed ablation contribution toward top_career (+ pushes toward it, - away)


class PredictResponse(BaseModel):
    predictions: list[Prediction]
    top_career: str
    confidence: float          # margin between top-1 and top-2 (0..1)
    uncertain: bool            # True when the call is close
    model_version: str
    algorithm: str
    explanation: list[FeatureContribution] | None = None  # top feature contributors, None if unavailable


@app.get("/health")
def health(_model=Depends(require_model)):
    return {
        "status": "ok",
        "model_version": _meta.get("model_version"),
        "algorithm": _meta.get("chosen_algorithm"),
        "cv_accuracy": _meta.get("cv_accuracy_mean"),
    }


@app.get("/meta")
def meta(_model=Depends(require_model)):
    # _meta (from model_meta.json) is spread last so its own feature_order/labels
    # -- what the loaded model was actually trained on -- win over the fallback
    # defaults on the left when present, which is the common case; the explicit
    # keys only matter for a model_meta.json that predates those fields.
    return {"feature_order": FEATURE_ORDER, "labels": CAREER_LABELS, **_meta}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest, uid: str = Depends(verify_auth), model=Depends(require_model)):
    # Build the ordered vector the model expects. Each value is coerced to a
    # finite number, then clamped to [0,1]. Unknown feature names are ignored;
    # missing or non-finite values default to 0 (never crashes the service).
    def clean(x: float) -> float:
        return 0.0 if not math.isfinite(x) else min(1.0, max(0.0, x))

    vec = np.array(
        [clean(float(req.features.get(f, 0.0))) for f in FEATURE_ORDER],
        dtype=float,
    ).reshape(1, -1)

    proba = model.predict_proba(vec)[0]
    classes = list(model.classes_)
    ranked = sorted(zip(classes, proba), key=lambda t: -t[1])

    # Confidence is always the margin between the true top-1 and top-2 across
    # every class, regardless of top_k -- computed from the full ranked list,
    # not the top_k-truncated slice returned to the caller. (Truncating first
    # meant top_k=1 turned "confidence" into the raw top-1 probability instead
    # of a margin, which could flip `uncertain` for the same prediction purely
    # based on how many results were asked for.)
    confidence = round(float(ranked[0][1] - (ranked[1][1] if len(ranked) > 1 else 0.0)), 4)
    top = ranked[: req.top_k]
    preds = [Prediction(career=c, probability=round(float(p), 4)) for c, p in top]

    top_idx = classes.index(preds[0].career)
    explanation = explain_top_class(model, vec, top_idx, float(proba[top_idx]))

    return PredictResponse(
        predictions=preds,
        top_career=preds[0].career,
        confidence=confidence,
        uncertain=confidence < 0.15,
        model_version=_meta.get("model_version", "2.0"),
        algorithm=_meta.get("chosen_algorithm", "Random Forest"),
        explanation=[FeatureContribution(**c) for c in explanation] if explanation else None,
    )
