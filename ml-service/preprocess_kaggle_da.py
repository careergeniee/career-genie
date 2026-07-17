"""
preprocess_kaggle_da.py
========================
Augments real_dataset_so.csv with real Data Analyst rows from Kaggle's own
2020 "Machine Learning & Data Science Survey" (official Kaggle competition
data: kaggle.com/c/kaggle-survey-2020 -- download the CSV and place it at
data/kaggle_survey_2020_responses.csv).

Why: real_dataset_so.csv's Data Analyst class is thin (178 rows) because the
Stack Overflow survey only has an ambiguous combined "Data or business
analyst" DevType. The Kaggle survey asks respondents to self-select "Data
Analyst" as their specific job title (Q5) -- 1,475 real respondents did, a
far more precise label. Cybersecurity Analyst and UI/UX Designer have no
counterpart in this survey at all (it's data-science-only), so this script
only ever touches the Data Analyst class.

What makes this honest (same rules as preprocess_so.py):
    * Label = Q5, the respondent's own stated current job title.
    * Features = tools/languages the respondent ACTUALLY reported using
      (Q7 languages, Q14 viz libraries, Q16 ML frameworks, Q26_A cloud
      platforms, Q29_A databases). No feature is derived from the label.
    * Personality traits, html_css, react, backend_apis, networking_security,
      linux_devops, mobile_dev, ui_ux_design have no counterpart in this
      survey either (it never asks about web/mobile/security tooling) and
      stay 0, exactly like every other unsupported feature in
      real_dataset_so.csv.

Run:
    python preprocess_kaggle_da.py     # updates real_dataset_so.csv in place
    python train.py --data real_dataset_so.csv
"""

from __future__ import annotations
import os
import pandas as pd
from career_data import FEATURE_ORDER

HERE = os.path.dirname(os.path.abspath(__file__))
CSV_FILE = os.path.join(HERE, "data", "kaggle_survey_2020_responses.csv")
DATASET_FILE = os.path.join(HERE, "real_dataset_so.csv")

MAX_PER_CLASS = 4000  # same cap preprocess_so.py uses
SEED = 42

LANGS = {"Python": "Q7_Part_1", "R": "Q7_Part_2", "SQL": "Q7_Part_3",
          "Javascript": "Q7_Part_7", "Julia": "Q7_Part_8", "MATLAB": "Q7_Part_11"}
VIZ_COLS = [f"Q14_Part_{i}" for i in range(1, 11)]       # Matplotlib..Leaflet/Folium
ML_COLS = [f"Q16_Part_{i}" for i in range(1, 15)]        # Scikit-learn..JAX
CLOUD_COLS = [f"Q26_A_Part_{i}" for i in range(1, 11)]   # AWS..Tencent Cloud
DB_COLS = [f"Q29_A_Part_{i}" for i in range(1, 17)]      # MySQL..Google Cloud Firestore


def graded(n_hits: int, saturate_at: int = 2) -> float:
    """0 hits -> 0.0; saturate_at or more hits -> 1.0 (linear in between)."""
    return min(1.0, n_hits / saturate_at)


def count_selected(row: pd.Series, cols: list[str]) -> int:
    return sum(1 for c in cols if c in row and pd.notna(row[c]))


def build_row(row: pd.Series) -> dict[str, float]:
    out = {f: 0.0 for f in FEATURE_ORDER}  # traits & unsupported features stay 0
    out["python"] = 1.0 if pd.notna(row.get(LANGS["Python"])) else 0.0
    out["javascript"] = 1.0 if pd.notna(row.get(LANGS["Javascript"])) else 0.0
    out["sql"] = 1.0 if pd.notna(row.get(LANGS["SQL"])) else 0.0
    out["statistics"] = graded(
        sum(1 for lang in ("R", "Julia", "MATLAB") if pd.notna(row.get(LANGS[lang])))
    )
    out["machine_learning"] = graded(count_selected(row, ML_COLS))
    out["data_visualization"] = graded(count_selected(row, VIZ_COLS))
    out["cloud"] = graded(count_selected(row, CLOUD_COLS))
    out["databases"] = graded(count_selected(row, DB_COLS), 3)
    return out


def main() -> None:
    print(f"Loading {CSV_FILE} ...")
    usecols = ["Q5"] + list(LANGS.values()) + VIZ_COLS + ML_COLS + CLOUD_COLS + DB_COLS
    df = pd.read_csv(CSV_FILE, usecols=usecols, low_memory=False, skiprows=[1])
    print(f"  Raw rows: {len(df)}")

    df = df[df["Q5"] == "Data Analyst"]
    print(f"  Self-identified Data Analyst rows: {len(df)}")

    records = []
    for _, row in df.iterrows():
        feats = build_row(row)
        if sum(feats.values()) == 0.0:
            continue
        feats["career"] = "Data Analyst"
        records.append(feats)
    new_rows = pd.DataFrame(records)[FEATURE_ORDER + ["career"]]
    print(f"  Rows with usable tech answers: {len(new_rows)}")

    existing = pd.read_csv(DATASET_FILE)
    before = len(existing[existing["career"] == "Data Analyst"])

    merged = pd.concat([existing, new_rows], ignore_index=True)
    merged = pd.concat([
        g.sample(min(len(g), MAX_PER_CLASS), random_state=SEED)
        for _, g in merged.groupby("career")
    ], ignore_index=True)

    after = len(merged[merged["career"] == "Data Analyst"])
    print(f"\n  Data Analyst rows: {before} -> {after}")
    print("\n  Final class distribution:")
    print(merged["career"].value_counts().to_string())

    merged.to_csv(DATASET_FILE, index=False)
    print(f"\nSaved {len(merged)} rows -> {DATASET_FILE}")


if __name__ == "__main__":
    main()
