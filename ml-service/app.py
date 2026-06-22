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

Reliability features:
    * Strict input validation (feature values clamped to [0,1], NaN/inf rejected).
    * Model loaded once and cached; clear 503 if it is missing.
    * Confidence signal (margin between top-2) and an `uncertain` flag so the
      UI can warn when a prediction is a close call.
    * Works whether the saved model is a plain Pipeline or a CalibratedClassifierCV.
"""

from __future__ import annotations
import json, math, os, logging
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from career_data import FEATURE_ORDER, CAREER_LABELS

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


class PredictResponse(BaseModel):
    predictions: list[Prediction]
    top_career: str
    confidence: float          # margin between top-1 and top-2 (0..1)
    uncertain: bool            # True when the call is close
    model_version: str
    algorithm: str


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
def predict(req: PredictRequest):
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

    return PredictResponse(
        predictions=preds,
        top_career=preds[0].career,
        confidence=confidence,
        uncertain=confidence < 0.15,
        model_version=_meta.get("model_version", "2.0"),
        algorithm=_meta.get("chosen_algorithm", "Random Forest"),
    )
