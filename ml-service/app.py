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
                       + a per-prediction SHAP feature-contribution breakdown
                       (auth required -- see auth.py)

Reliability features:
    * Strict input validation (feature values clamped to [0,1], NaN/inf rejected).
    * Model loaded once and cached; clear 503 if it is missing.
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
import json, math, os, logging
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
_explainer = None  # shap.TreeExplainer over the underlying tree ensemble, built once


def get_model():
    global _model, _meta
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError("career_model.pkl not found. Run `python train.py` first.")
        _model = joblib.load(MODEL_PATH)
        if os.path.exists(META_PATH):
            with open(META_PATH) as fh:
                _meta = json.load(fh)
        log.info("Model loaded: %s v%s",
                 _meta.get("chosen_algorithm", "?"), _meta.get("model_version", "?"))
    return _model


def _underlying_tree_pipeline(model):
    """
    Reach into a CalibratedClassifierCV to get the fitted scaler+tree Pipeline
    it wraps (for SHAP, which needs direct tree access -- it can't explain
    through isotonic calibration). Falls back to `model` itself if it's
    already a plain Pipeline (e.g. during local experimentation). Returns
    None if the structure doesn't match either shape, so callers can degrade
    gracefully instead of crashing prediction on an explainability nice-to-have.
    """
    try:
        from sklearn.calibration import CalibratedClassifierCV
        from sklearn.pipeline import Pipeline
        if isinstance(model, CalibratedClassifierCV):
            cc = model.calibrated_classifiers_[0]
            # sklearn renamed base_estimator -> estimator in 1.4; support both.
            return getattr(cc, "estimator", None) or getattr(cc, "base_estimator", None)
        if isinstance(model, Pipeline):
            return model
    except Exception:
        pass
    return None


def get_explainer():
    """
    Lazily builds and caches a SHAP TreeExplainer over the model's Random
    Forest. Only meaningful for tree ensembles (SHAP's TreeExplainer doesn't
    support arbitrary estimators) -- returns None for anything else, and the
    /predict endpoint treats that as "no explanation available" rather than
    an error.
    """
    global _explainer
    if _explainer is None:
        pipe = _underlying_tree_pipeline(get_model())
        clf = pipe.named_steps.get("clf") if pipe is not None else None
        if clf is not None and clf.__class__.__name__ in ("RandomForestClassifier", "GradientBoostingClassifier"):
            import shap
            _explainer = shap.TreeExplainer(clf)
        else:
            _explainer = False  # sentinel: "checked, not explainable" (vs. None = "not checked yet")
    return _explainer or None


def explain_top_class(vec: np.ndarray, top_class: str, top_n: int = 5) -> list[dict] | None:
    """
    Per-prediction SHAP feature contributions toward `top_class`, ranked by
    |contribution| descending. Returns None (never raises) if the model isn't
    a supported tree ensemble or SHAP isn't available -- explainability is a
    nice-to-have and must never break the actual prediction.
    """
    explainer = get_explainer()
    if explainer is None:
        return None
    pipe = _underlying_tree_pipeline(get_model())
    try:
        scaler = pipe.named_steps.get("scaler")
        vec_scaled = scaler.transform(vec) if scaler is not None else vec
        classes = list(pipe.named_steps["clf"].classes_)
        idx = classes.index(top_class)
        sv = np.asarray(explainer.shap_values(vec_scaled))
        # TreeExplainer returns (n_samples, n_features, n_classes) for multiclass RF.
        row = sv[0, :, idx] if sv.ndim == 3 else sv[idx][0]
        ranked = sorted(zip(FEATURE_ORDER, row), key=lambda t: -abs(t[1]))
        return [{"feature": f, "contribution": round(float(c), 4)} for f, c in ranked[:top_n]]
    except Exception as exc:
        log.warning("SHAP explanation failed, omitting it from the response: %s", exc)
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
    contribution: float        # signed SHAP value toward top_career (+ pushes toward it, - away)


class PredictResponse(BaseModel):
    predictions: list[Prediction]
    top_career: str
    confidence: float          # margin between top-1 and top-2 (0..1)
    uncertain: bool            # True when the call is close
    model_version: str
    algorithm: str
    explanation: list[FeatureContribution] | None = None  # top SHAP contributors, None if unavailable


@app.get("/health")
def health():
    try:
        get_model()
        return {
            "status": "ok",
            "model_version": _meta.get("model_version"),
            "algorithm": _meta.get("chosen_algorithm"),
            "cv_accuracy": _meta.get("cv_accuracy_mean"),
        }
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc))


@app.get("/meta")
def meta():
    get_model()
    return {"feature_order": FEATURE_ORDER, "labels": CAREER_LABELS, **_meta}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest, uid: str = Depends(verify_auth)):
    try:
        model = get_model()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

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

    top = ranked[: req.top_k]
    confidence = round(float(top[0][1] - (top[1][1] if len(top) > 1 else 0.0)), 4)
    preds = [Prediction(career=c, probability=round(float(p), 4)) for c, p in top]

    explanation = explain_top_class(vec, preds[0].career)

    return PredictResponse(
        predictions=preds,
        top_career=preds[0].career,
        confidence=confidence,
        uncertain=confidence < 0.15,
        model_version=_meta.get("model_version", "2.0"),
        algorithm=_meta.get("chosen_algorithm", "Random Forest"),
        explanation=[FeatureContribution(**c) for c in explanation] if explanation else None,
    )
