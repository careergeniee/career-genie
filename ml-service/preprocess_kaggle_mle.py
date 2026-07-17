"""
preprocess_kaggle_mle.py
=========================
Augments real_dataset_so.csv with real Machine Learning Engineer rows from
Kaggle's 2020 "Machine Learning & Data Science Survey" -- the same source
preprocess_kaggle_da.py uses for Data Analyst (see that file for the full
provenance note and download instructions).

Why: the SO 2024 survey maps "Developer, AI" to Machine Learning Engineer,
but that DevType is thin and the class ends up statistically indistinguishable
from Data Scientist (1 correct prediction out of 88 test rows -- noise, not
signal; see README "Honest limitations"). Kaggle's Q5 has 1,082 respondents
who self-selected "Machine Learning Engineer" specifically -- run this after
preprocess_kaggle_da.py to add real per-person tool-usage rows for this class
too.

Same honesty rules as preprocess_kaggle_da.py: label = Q5 (self-stated job),
features = tools actually reported used, no leakage. Uses the identical
build_row() derivation -- only the Q5 filter value changes.

Run (after preprocess_kaggle_da.py has already merged in Data Analyst rows):
    python preprocess_kaggle_mle.py    # updates real_dataset_so.csv in place
    python train.py --data real_dataset_so.csv
"""

from __future__ import annotations
import os
import pandas as pd
from career_data import FEATURE_ORDER
from preprocess_kaggle_da import build_row, CSV_FILE

HERE = os.path.dirname(os.path.abspath(__file__))
DATASET_FILE = os.path.join(HERE, "real_dataset_so.csv")

MAX_PER_CLASS = 4000
SEED = 42
KAGGLE_TITLE = "Machine Learning Engineer"
CAREER_LABEL = "Machine Learning Engineer"


def main() -> None:
    print(f"Loading {CSV_FILE} ...")
    from preprocess_kaggle_da import LANGS, VIZ_COLS, ML_COLS, CLOUD_COLS, DB_COLS
    usecols = ["Q5"] + list(LANGS.values()) + VIZ_COLS + ML_COLS + CLOUD_COLS + DB_COLS
    df = pd.read_csv(CSV_FILE, usecols=usecols, low_memory=False, skiprows=[1])
    print(f"  Raw rows: {len(df)}")

    df = df[df["Q5"] == KAGGLE_TITLE]
    print(f"  Self-identified {KAGGLE_TITLE} rows: {len(df)}")

    records = []
    for _, row in df.iterrows():
        feats = build_row(row)
        if sum(feats.values()) == 0.0:
            continue
        feats["career"] = CAREER_LABEL
        records.append(feats)
    new_rows = pd.DataFrame(records)[FEATURE_ORDER + ["career"]]
    print(f"  Rows with usable tech answers: {len(new_rows)}")

    existing = pd.read_csv(DATASET_FILE)
    before = len(existing[existing["career"] == CAREER_LABEL])

    merged = pd.concat([existing, new_rows], ignore_index=True)
    merged = pd.concat([
        g.sample(min(len(g), MAX_PER_CLASS), random_state=SEED)
        for _, g in merged.groupby("career")
    ], ignore_index=True)

    after = len(merged[merged["career"] == CAREER_LABEL])
    print(f"\n  {CAREER_LABEL} rows: {before} -> {after}")
    print("\n  Final class distribution:")
    print(merged["career"].value_counts().to_string())

    merged.to_csv(DATASET_FILE, index=False)
    print(f"\nSaved {len(merged)} rows -> {DATASET_FILE}")


if __name__ == "__main__":
    main()
