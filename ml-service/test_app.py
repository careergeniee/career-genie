"""
Tests for the Career Genie ML service.   Run:  pytest -q
Covers health, prediction correctness, input validation, clamping,
determinism, metadata, auth, and the feature-contribution explanation.
Requires career_model.pkl (run train.py first).
"""
from fastapi.testclient import TestClient
import app as A
from auth import AuthError

client = TestClient(A.app)

# /predict requires a valid Firebase ID token in real use (see auth.py); that
# needs a live Google JWKS round-trip we don't want in unit tests, so the
# happy-path tests below override the auth dependency the standard FastAPI
# way. test_predict_requires_auth() below restores the real dependency to
# verify the guard itself actually rejects missing/invalid tokens.
A.app.dependency_overrides[A.verify_auth] = lambda: "test-uid"

DATA_SCIENTIST = {
    # Values matched to real per-class feature averages in real_dataset_so.csv
    # (databases/cloud/statistics are what separate Data Scientist from Data
    # Analyst post-Kaggle-merge -- both classes now use python/sql/ML tools,
    # but Data Scientists report much heavier database + cloud + stats usage).
    "analytical": 0.9, "problem_solving": 0.85, "python": 0.95,
    "statistics": 0.9, "machine_learning": 0.85, "sql": 0.6,
    "data_visualization": 0.5, "databases": 0.65, "cloud": 0.55,
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


def test_predict_includes_explanation():
    # /predict must carry a well-formed ablation-based explanation for this profile.
    r = client.post("/predict", json={"features": DATA_SCIENTIST, "top_k": 5})
    body = r.json()
    explanation = body["explanation"]
    assert explanation is not None
    assert 1 <= len(explanation) <= 5
    for item in explanation:
        assert item["feature"] in A.FEATURE_ORDER
        assert isinstance(item["contribution"], float)
    # The features this profile deliberately maxes out should dominate the
    # explanation for its correctly-predicted top career.
    top_features = {item["feature"] for item in explanation}
    assert top_features & {"analytical", "python", "machine_learning", "statistics"}


def test_predict_mobile_developer():
    # Mobile is the best-supported class in the SO-2024 training data
    # (F1 ~0.72): a mobile-heavy profile must rank it first.
    r = client.post("/predict", json={"features": {"mobile_dev": 0.95, "javascript": 0.6, "react": 0.5}})
    assert r.json()["top_career"] == "Mobile App Developer"


def test_predict_designer():
    # Backed by the disclosed O*NET-profile synthetic rows (augment_profiles.py):
    # a design-heavy profile must rank UI/UX Designer first.
    r = client.post("/predict", json={"features": DESIGNER})
    assert r.json()["top_career"] == "UI/UX Designer"


def test_predict_cybersecurity():
    # Same augmentation covers Cybersecurity Analyst (SOC 15-1212.00).
    r = client.post("/predict", json={
        "features": {"networking_security": 0.95, "linux_devops": 0.7,
                     "python": 0.55, "cloud": 0.55}})
    assert r.json()["top_career"] == "Cybersecurity Analyst"


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


# ---------------------------------------------------------------------------
# Auth: temporarily drop the module-level override (see top of file) to
# verify /predict's guard actually rejects requests, instead of just trusting
# that wiring Depends(verify_auth) into app.py was enough.
# ---------------------------------------------------------------------------

def _drop_auth_override():
    A.app.dependency_overrides.pop(A.verify_auth, None)


def _restore_auth_override():
    A.app.dependency_overrides[A.verify_auth] = lambda: "test-uid"


def test_predict_requires_auth():
    _drop_auth_override()
    try:
        r = client.post("/predict", json={"features": DATA_SCIENTIST})
    finally:
        _restore_auth_override()
    assert r.status_code == 401


def test_predict_rejects_malformed_authorization_header():
    _drop_auth_override()
    try:
        r = client.post(
            "/predict",
            json={"features": DATA_SCIENTIST},
            headers={"Authorization": "not-a-bearer-token"},
        )
    finally:
        _restore_auth_override()
    assert r.status_code == 401


def test_verify_auth_dependency_maps_auth_error_to_401():
    # Unit-level check of verify_auth itself, independent of the TestClient
    # override plumbing above: a garbage token must raise AuthError, which
    # verify_auth must turn into HTTPException(401) rather than a 500.
    from fastapi import HTTPException
    try:
        A.verify_auth(authorization="Bearer not-a-real-jwt")
        assert False, "expected verify_auth to raise"
    except HTTPException as exc:
        assert exc.status_code == 401


def test_health_and_meta_do_not_require_auth():
    # /health and /meta intentionally stay open even with the real auth
    # dependency active (they're used for uptime checks and the frontend's
    # unauthenticated cold-start warm-up ping).
    _drop_auth_override()
    try:
        health_status = client.get("/health").status_code
        meta_status = client.get("/meta").status_code
    finally:
        _restore_auth_override()
    assert health_status == 200
    assert meta_status == 200
