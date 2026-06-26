"""
preprocess.py
=============
Maps a real Kaggle career dataset to CareerGenie's 21-feature schema.

Usage:
    python preprocess.py --input your_dataset.csv --output real_dataset.csv

After running, real_dataset.csv will have exactly the same columns as the
synthetic dataset (21 features + career label), so train.py can use it
directly.

INSTRUCTIONS:
  1. Download a Kaggle career dataset and place it in ml-service/
  2. Open this file and fill in COLUMN_MAP and CAREER_MAP for your CSV
  3. Run: python preprocess.py --input your_file.csv --output real_dataset.csv
  4. Then retrain: python train.py --data real_dataset.csv
"""

from __future__ import annotations
import argparse
import pandas as pd
import numpy as np

from career_data import FEATURE_ORDER, CAREER_LABELS

# ---------------------------------------------------------------------------
# STEP A: Map dataset columns -> our feature names
#
# Left side  = exact column name in your downloaded CSV
# Right side = our feature name (must be one of FEATURE_ORDER)
#
# For columns rated 1-5 or 0-10, we normalise to 0-1 automatically.
# If a feature has no matching column, it will be filled with 0.5 (neutral).
# ---------------------------------------------------------------------------
COLUMN_MAP: dict[str, str] = {
    # ── Personality / soft skills ──────────────────────────────────────────
    # Rename these to match your CSV's actual column names on the LEFT side.
    "leadership_score":         "leadership",
    "creativity_score":         "creativity",
    "communication_skills":     "communication",
    "problem_solving":          "problem_solving",
    "analytical_thinking":      "analytical",
    "teamwork":                 "teamwork",

    # ── Technical skills ───────────────────────────────────────────────────
    "python":                   "python",
    "javascript":               "javascript",
    "sql":                      "sql",
    "statistics":               "statistics",
    "machine_learning":         "machine_learning",
    "data_visualization":       "data_visualization",
    "html_css":                 "html_css",
    "react":                    "react",
    "backend_apis":             "backend_apis",
    "databases":                "databases",
    "cloud":                    "cloud",
    "networking_security":      "networking_security",
    "linux_devops":             "linux_devops",
    "mobile_dev":               "mobile_dev",
    "ui_ux_design":             "ui_ux_design",
}

# ---------------------------------------------------------------------------
# STEP B: Map the dataset's career labels -> our career names
#
# Left side  = exact value in the target column of your CSV
# Right side = one of our 10 CAREER_LABELS (must match exactly)
# ---------------------------------------------------------------------------
CAREER_MAP: dict[str, str] = {
    "Data Scientist":              "Data Scientist",
    "Machine Learning Engineer":   "Machine Learning Engineer",
    "Data Analyst":                "Data Analyst",
    "Web Developer":               "Frontend Developer",
    "Frontend Developer":          "Frontend Developer",
    "Backend Developer":           "Backend Developer",
    "Full Stack Developer":        "Full Stack Developer",
    "Software Developer":          "Backend Developer",
    "Cybersecurity Analyst":       "Cybersecurity Analyst",
    "Information Security":        "Cybersecurity Analyst",
    "Cloud Engineer":              "Cloud / DevOps Engineer",
    "DevOps Engineer":             "Cloud / DevOps Engineer",
    "Cloud / DevOps Engineer":     "Cloud / DevOps Engineer",
    "Mobile Developer":            "Mobile App Developer",
    "Mobile App Developer":        "Mobile App Developer",
    "UI/UX Designer":              "UI/UX Designer",
    "UX Designer":                 "UI/UX Designer",
    "UI Designer":                 "UI/UX Designer",
}

# Name of the target column in your CSV (the career label column)
TARGET_COLUMN = "Role"   # ← change this to your CSV's actual column name


def normalise_column(series: pd.Series) -> pd.Series:
    """Scale any numeric column to 0..1."""
    mn, mx = series.min(), series.max()
    if mx == mn:
        return pd.Series(np.full(len(series), 0.5))
    return (series - mn) / (mx - mn)


def preprocess(input_path: str, output_path: str) -> None:
    print(f"Loading {input_path} ...")
    raw = pd.read_csv(input_path)
    print(f"  Shape: {raw.shape}")
    print(f"  Columns: {raw.columns.tolist()}")

    # ── Map career labels ──────────────────────────────────────────────────
    if TARGET_COLUMN not in raw.columns:
        raise ValueError(
            f"Target column '{TARGET_COLUMN}' not found. "
            f"Available columns: {raw.columns.tolist()}"
        )
    raw["career"] = raw[TARGET_COLUMN].map(CAREER_MAP)
    before = len(raw)
    raw = raw.dropna(subset=["career"])
    dropped = before - len(raw)
    if dropped:
        print(f"  Dropped {dropped} rows with unmapped career labels.")
    print(f"  Career distribution:\n{raw['career'].value_counts()}")

    # ── Build feature matrix ───────────────────────────────────────────────
    out = pd.DataFrame(index=raw.index)
    for csv_col, feature in COLUMN_MAP.items():
        if csv_col in raw.columns:
            out[feature] = normalise_column(raw[csv_col].fillna(0))
        # else: feature stays missing, filled with neutral below

    # Fill any feature not covered by the dataset with 0.5 (neutral/unknown)
    for f in FEATURE_ORDER:
        if f not in out.columns:
            print(f"  WARNING: '{f}' not in dataset — filling with 0.5 (neutral)")
            out[f] = 0.5

    out = out[FEATURE_ORDER]   # ensure correct column order
    out["career"] = raw["career"].values

    out.to_csv(output_path, index=False)
    print(f"\nSaved {len(out)} rows -> {output_path}")
    print("Run: python train.py --data", output_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input",  required=True, help="Path to raw Kaggle CSV")
    parser.add_argument("--output", default="real_dataset.csv")
    args = parser.parse_args()
    preprocess(args.input, args.output)
