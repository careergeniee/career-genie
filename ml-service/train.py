"""
train.py  (v2 - multi-model comparison + probability calibration)
=================================================================
Trains the Career Genie career-recommendation model.

What it does:
  1. Generates the domain-driven synthetic dataset.
  2. Compares FOUR algorithms with 5-fold cross-validation:
       Random Forest, Gradient Boosting, K-Nearest Neighbors,
       Logistic Regression.
  3. Selects the best algorithm by CV accuracy.
  4. Wraps the winner in CalibratedClassifierCV so the predicted
     probabilities are well-calibrated (important: those probabilities
     are shown to students as "match %").
  5. Saves the calibrated model + a rich model_meta.json containing the
     full comparison table, feature importances, and metrics.

  python train.py

The printed comparison table and metrics go straight into your FYP report's
"Model Selection" and "Model Evaluation" sections.
"""

from __future__ import annotations
import json, os, time
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score, classification_report, confusion_matrix,
    log_loss, f1_score,
)

from career_data import generate_dataset, FEATURE_ORDER, CAREER_LABELS

HERE = os.path.dirname(__file__)
MODEL_VERSION = "3.0"

# Selection policy: we prefer an interpretable model (Random Forest gives
# feature-importance scores we show to students) when its accuracy is within
# TOLERANCE of the best performer. This is a deliberate, documented
# accuracy-vs-interpretability trade-off, not a fixed choice.
PREFERRED_ALGORITHM = "Random Forest"
TOLERANCE = 0.02  # 2 percentage points


def build_candidates() -> dict[str, Pipeline]:
    """Each candidate is a scaler + classifier pipeline."""
    return {
        "Random Forest": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", RandomForestClassifier(
                n_estimators=300, min_samples_leaf=2, max_features="sqrt",
                class_weight="balanced", random_state=42, n_jobs=-1)),
        ]),
        "Gradient Boosting": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", GradientBoostingClassifier(
                n_estimators=200, max_depth=3, learning_rate=0.1, random_state=42)),
        ]),
        "K-Nearest Neighbors": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", KNeighborsClassifier(n_neighbors=15, weights="distance")),
        ]),
        "Logistic Regression": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(max_iter=2000, C=1.0, random_state=42)),
        ]),
    }


def main() -> None:
    import sys
    # Accept --data path/to/real_dataset.csv to train on real data instead of synthetic.
    data_path = None
    if "--data" in sys.argv:
        data_path = sys.argv[sys.argv.index("--data") + 1]
    else:
        # Render's build command invokes `python train.py` with no arguments --
        # without this, that silently retrained on the synthetic dataset on
        # every single deploy, discarding the real, calibrated, committed
        # model regardless of what career_model.pkl already held. If the real
        # dataset is sitting right here (it's committed to the repo), use it
        # by default; only fall back to synthetic if it's genuinely absent
        # (e.g. a fresh clone that hasn't run preprocess_so.py yet).
        default_real_path = os.path.join(HERE, "real_dataset_so.csv")
        if os.path.exists(default_real_path):
            data_path = default_real_path

    if data_path:
        import pandas as pd
        print(f"Loading real dataset: {data_path} ...")
        df = pd.read_csv(data_path)
    else:
        print("Generating synthetic dataset (pass --data real_dataset.csv to use real data) ...")
        df = generate_dataset(n_per_class=800, noise=0.14, seed=42)

    X = df[FEATURE_ORDER].values
    y = df["career"].values
    # Row provenance (real survey vs synthetic O*NET-profile rows added by
    # augment_profiles.py). Carried through the split so we can ALSO report
    # metrics on real rows alone -- synthetic-class scores only measure
    # profile recovery and must never be conflated with real-world accuracy.
    source = df["source"].values if "source" in df.columns else None
    print(f"  {X.shape[0]} samples x {X.shape[1]} features, {len(CAREER_LABELS)} classes")
    if source is not None:
        n_synth = int((source != "real").sum())
        print(f"  ({X.shape[0] - n_synth} real rows, {n_synth} synthetic profile rows)")

    if source is not None:
        X_train, X_test, y_train, y_test, _, source_test = train_test_split(
            X, y, source, test_size=0.2, stratify=y, random_state=42)
    else:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, stratify=y, random_state=42)
        source_test = None

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    # ---- 1. Compare candidates -----------------------------------------
    print("\nComparing algorithms (5-fold CV) ...")
    comparison = []
    for name, pipe in build_candidates().items():
        t0 = time.time()
        scores = cross_val_score(pipe, X, y, cv=cv, scoring="accuracy", n_jobs=-1)
        dt = time.time() - t0
        comparison.append({
            "algorithm": name,
            "cv_accuracy_mean": round(float(scores.mean()), 4),
            "cv_accuracy_std": round(float(scores.std()), 4),
            "cv_time_sec": round(dt, 2),
        })
        print(f"  {name:<22} acc={scores.mean():.4f} (+/-{scores.std():.4f})  [{dt:.1f}s]")

    comparison.sort(key=lambda d: -d["cv_accuracy_mean"])
    top = comparison[0]
    best_name = top["algorithm"]
    selection_reason = f"highest CV accuracy ({top['cv_accuracy_mean']:.4f})"

    # Apply the interpretability preference if it is competitive.
    pref = next((c for c in comparison if c["algorithm"] == PREFERRED_ALGORITHM), None)
    if pref and best_name != PREFERRED_ALGORITHM:
        if top["cv_accuracy_mean"] - pref["cv_accuracy_mean"] <= TOLERANCE:
            selection_reason = (
                f"{PREFERRED_ALGORITHM} chosen for interpretability; its CV accuracy "
                f"({pref['cv_accuracy_mean']:.4f}) is within {TOLERANCE:.0%} of the best "
                f"({best_name}, {top['cv_accuracy_mean']:.4f})")
            best_name = PREFERRED_ALGORITHM
    print(f"\nBest by accuracy: {top['algorithm']}  |  Selected: {best_name}")
    print(f"Reason: {selection_reason}")

    # ---- 2. Calibrate the winner ---------------------------------------
    print("Calibrating probabilities (isotonic, 5-fold) ...")
    base = build_candidates()[best_name]
    model = CalibratedClassifierCV(base, method="isotonic", cv=5, ensemble=False)
    model.fit(X_train, y_train)

    # ---- 3. Evaluate ----------------------------------------------------
    pred = model.predict(X_test)
    proba = model.predict_proba(X_test)
    acc = accuracy_score(y_test, pred)
    macro_f1 = f1_score(y_test, pred, average="macro")
    ll = log_loss(y_test, proba, labels=model.classes_)
    print(f"\nCalibrated test accuracy : {acc:.4f}")
    print(f"Macro F1                 : {macro_f1:.4f}")
    print(f"Log loss (lower=better)  : {ll:.4f}")
    print("\nClassification report:")
    print(classification_report(y_test, pred))
    print("Confusion matrix (rows=true, cols=pred):")
    print(confusion_matrix(y_test, pred, labels=CAREER_LABELS))

    if source_test is not None:
        real_mask = source_test == "real"
        real_acc = accuracy_score(y_test[real_mask], pred[real_mask])
        print(f"\nREAL-ONLY test subset ({int(real_mask.sum())} rows) -- the "
              f"honest real-world number (synthetic-class scores above only "
              f"measure O*NET-profile recovery):")
        print(f"  Real-only accuracy: {real_acc:.4f}")
        print(classification_report(y_test[real_mask], pred[real_mask]))

    # ---- 4. Feature importance (from a RandomForest on full data) -------
    rf = RandomForestClassifier(
        n_estimators=300, min_samples_leaf=2, max_features="sqrt",
        class_weight="balanced", random_state=42, n_jobs=-1)
    rf.fit(StandardScaler().fit_transform(X), y)
    ranked = sorted(zip(FEATURE_ORDER, rf.feature_importances_), key=lambda t: -t[1])
    print("\nTop 8 features:")
    for n, imp in ranked[:8]:
        print(f"  {n:<22} {imp:.4f}")

    # ---- 5. Persist -----------------------------------------------------
    joblib.dump(model, f"{HERE}/career_model.pkl", compress=3)
    meta = {
        "model_version": MODEL_VERSION,
        "dataset": os.path.basename(data_path) if data_path else "synthetic",
        "chosen_algorithm": best_name,
        "selected_for": selection_reason,
        "best_by_accuracy": top["algorithm"],
        "calibration": "isotonic",
        "feature_order": FEATURE_ORDER,
        "labels": CAREER_LABELS,
        "test_accuracy": round(float(acc), 4),
        "macro_f1": round(float(macro_f1), 4),
        "log_loss": round(float(ll), 4),
        "cv_accuracy_mean": (pref if best_name == PREFERRED_ALGORITHM and pref else top)["cv_accuracy_mean"],
        "cv_accuracy_std": (pref if best_name == PREFERRED_ALGORITHM and pref else top)["cv_accuracy_std"],
        "algorithm_comparison": comparison,
        "feature_importance": {n: round(float(i), 4) for n, i in ranked},
        "trained_samples": int(X_train.shape[0]),
    }
    with open(f"{HERE}/model_meta.json", "w") as fh:
        json.dump(meta, fh, indent=2)
    print(f"\nSaved career_model.pkl (calibrated {best_name}) and model_meta.json")


if __name__ == "__main__":
    main()
