"""
Tests for the Career Genie ML service.   Run:  pytest -q
Covers health, prediction correctness, input validation, clamping,
determinism, and metadata. Requires career_model.pkl (run train.py first).
"""
from fastapi.testclient import TestClient
import app as A

client = TestClient(A.app)

DATA_SCIENTIST = {
    "analytical": 0.9, "problem_solving": 0.85, "python": 0.9,
    "statistics": 0.9, "machine_learning": 0.85, "sql": 0.75,
    "data_visualization": 0.8,
}
DESIGNER = {"creativity": 0.95, "ui_ux_design": 0.95, "communication": 0.8, "html_css": 0.6}


def test_health_ok():
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["algorithm"]
    assert 0.5 < body["cv_accuracy"] <= 1.0


def test_meta_shape():
    r = client.get("/meta")
    assert r.status_code == 200
    body = r.json()
    assert len(body["feature_order"]) == 21
    assert len(body["labels"]) == 10
    assert len(body["algorithm_comparison"]) == 4


def test_predict_data_scientist():
    r = client.post("/predict", json={"features": DATA_SCIENTIST, "top_k": 5})
    assert r.status_code == 200
    body = r.json()
    assert body["top_career"] == "Data Scientist"
    assert len(body["predictions"]) == 5
    total = sum(p["probability"] for p in body["predictions"])
    assert total <= 1.0001  # top-5 of a proper distribution
    assert 0.0 <= body["confidence"] <= 1.0
    assert isinstance(body["uncertain"], bool)


def test_predict_designer():
    r = client.post("/predict", json={"features": DESIGNER})
    assert r.json()["top_career"] == "UI/UX Designer"


def test_probabilities_descending():
    body = client.post("/predict", json={"features": DATA_SCIENTIST}).json()
    probs = [p["probability"] for p in body["predictions"]]
    assert probs == sorted(probs, reverse=True)


def test_clamping_out_of_range():
    # Values outside [0,1] must be accepted and clamped, not rejected.
    r = client.post("/predict", json={"features": {"python": 5.0, "machine_learning": -3}})
    assert r.status_code == 200


def test_determinism():
    a = client.post("/predict", json={"features": DATA_SCIENTIST}).json()
    b = client.post("/predict", json={"features": DATA_SCIENTIST}).json()
    assert a["predictions"] == b["predictions"]


def test_empty_features_rejected():
    r = client.post("/predict", json={"features": {}})
    assert r.status_code == 422


def test_nonfinite_sanitized():
    # Non-finite values must be coerced to 0, not crash the service.
    r = client.post("/predict", content='{"features": {"python": NaN, "machine_learning": 0.9}, "top_k": 5}',
                    headers={"content-type": "application/json"})
    assert r.status_code == 200
    assert r.json()["top_career"]


def test_unknown_features_ignored():
    r = client.post("/predict", json={"features": {"not_a_real_feature": 0.9, "python": 0.5}})
    assert r.status_code == 200
