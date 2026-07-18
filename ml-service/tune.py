"""
tune.py
=======
Hyperparameter tuning for the Career Genie ML model.
Runs RandomizedSearchCV over the 4 candidate algorithms to find the best
parameters for each, maximizing accuracy (with 5-fold CV).

Persists the best parameters to tuned_params.json so train.py can load them
without having to re-run this expensive search on every deploy.
"""

import os
import json
import time
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import RandomizedSearchCV, StratifiedKFold, train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.utils.class_weight import compute_sample_weight

from career_data import FEATURE_ORDER

HERE = os.path.dirname(os.path.abspath(__file__))
DATASET_FILE = os.path.join(HERE, "real_dataset_so.csv")
OUT_FILE = os.path.join(HERE, "tuned_params.json")

def get_param_distributions():
    return {
        "Random Forest": {
            "clf__n_estimators": [200, 300, 500, 800],
            "clf__max_depth": [None, 15, 25, 40],
            "clf__min_samples_leaf": [1, 2, 4, 8],
            "clf__max_features": ["sqrt", "log2"]
        },
        "Gradient Boosting": {
            "clf__n_estimators": [100, 200, 300, 500],
            "clf__max_depth": [3, 5, 7],
            "clf__learning_rate": [0.01, 0.05, 0.1, 0.2],
            "clf__subsample": [0.8, 1.0]
        },
        "K-Nearest Neighbors": {
            "clf__n_neighbors": [5, 10, 15, 25, 40],
            "clf__weights": ["uniform", "distance"],
            "clf__metric": ["euclidean", "manhattan"]
        },
        "Logistic Regression": {
            # penalty deliberately not searched: LogisticRegression's default
            # is already "l2", a single-value grid entry was a no-op search,
            # and explicitly setting it triggers a sklearn 1.8+ FutureWarning
            # (the param is slated for removal in 1.10 in favor of l1_ratio/C).
            "clf__C": [0.01, 0.1, 1.0, 10.0, 100.0],
            "clf__solver": ["lbfgs", "saga"]
        }
    }

def build_base_candidates():
    return {
        "Random Forest": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", RandomForestClassifier(class_weight="balanced", random_state=42, n_jobs=1)) # inner jobs 1 to avoid oversubscription with n_jobs=-1 below
        ]),
        "Gradient Boosting": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", GradientBoostingClassifier(random_state=42))
        ]),
        "K-Nearest Neighbors": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", KNeighborsClassifier())
        ]),
        "Logistic Regression": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(class_weight="balanced", random_state=42, max_iter=2000))
        ])
    }

def main():
    print(f"Loading {DATASET_FILE} ...")
    df = pd.read_csv(DATASET_FILE)
    X = df[FEATURE_ORDER].values
    y = df["career"].values
    source = df["source"].values if "source" in df.columns else None
    
    # Bug 1 Fix: Ensure identical split as train.py and ONLY keep the train set.
    # We do not even define an X_test variable to strictly enforce this.
    if source is not None:
        X_train, _, y_train, _, _, _ = train_test_split(
            X, y, source, test_size=0.2, stratify=y, random_state=42)
    else:
        X_train, _, y_train, _ = train_test_split(
            X, y, test_size=0.2, stratify=y, random_state=42)
            
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    param_grids = get_param_distributions()
    candidates = build_base_candidates()
    
    
    best_params_out = {}
    
    # Pre-compute sample weight for GBC to be fair
    sw = compute_sample_weight("balanced", y_train)
    
    for name, pipe in candidates.items():
        print(f"\nTuning {name}...")
        
        # Dynamic iterations so we don't spend 2 hours tuning GBC
        if name == "Gradient Boosting":
            n_iter = 3
        elif name == "Random Forest":
            n_iter = 5
        else:
            n_iter = 10
            
        search = RandomizedSearchCV(
            pipe, param_distributions=param_grids[name], 
            n_iter=n_iter, cv=cv, scoring="accuracy", 
            n_jobs=-1, random_state=42, verbose=1
        )
        
        t0 = time.time()
        
        # Pass sample_weight only to GBC as we do in train.py (others have class_weight)
        if name == "Gradient Boosting":
            search.fit(X_train, y_train, **{'clf__sample_weight': sw})
        else:
            search.fit(X_train, y_train)
            
        dt = time.time() - t0
        
        print(f"Done in {dt:.1f}s")
        print(f"Best CV accuracy: {search.best_score_:.4f}")
        print(f"Best params: {search.best_params_}")
        
        # Clean up the 'clf__' prefix for the output JSON
        clean_params = {k.replace('clf__', ''): v for k, v in search.best_params_.items()}
        best_params_out[name] = clean_params
        
    print("\nSaving tuned_params.json...")
    with open(OUT_FILE, "w") as f:
        json.dump(best_params_out, f, indent=2)
        
if __name__ == "__main__":
    main()
