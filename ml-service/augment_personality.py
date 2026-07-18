"""
augment_personality.py
======================
Adds SYNTHETIC rows that carry *personality-trait signal only* for ALL 10
career classes to real_dataset_so.csv.

Why this exists: every real row in the dataset (Stack Overflow 2022-2024,
Kaggle 2020 surveys) has its 6 personality features set to 0.0 — those
surveys simply don't measure personality traits. The trained model therefore
has ZERO training signal on the personality features (leadership, creativity,
communication, problem_solving, analytical, teamwork), even though:

  1. The app's assessment UI collects personality self-ratings from users.
  2. The offline fallback scorer already uses them via cosine similarity
     against the O*NET Work Styles profiles in career_data.CAREERS.
  3. The career profiles in career_data.py have carefully researched,
     O*NET-sourced personality values for every role.

This script is the symmetric inverse of augment_profiles.py:

  augment_profiles.py  → 2 classes, skills nonzero, personality ZEROED
  augment_personality.py → ALL 10 classes, personality nonzero, skills ZEROED

The same generate_dataset() helper samples noisy candidates around each
career's full O*NET profile; this script then zeros all 15 skill features
and retains only the 6 personality-trait values.

Honesty rules for this augmentation:
    * FULL DISCLOSURE: every synthetic row carries
      source="synthetic-onet-personality" (distinct from both "real" and
      "synthetic-onet"). train.py reports metrics on the real-only test
      subset separately, explicitly excluding BOTH synthetic source tags.
    * The 15 skill features are ZEROED (set to BASELINE=0.10) in these
      synthetic rows. If skill values were left nonzero only in
      personality-augmented rows, the model would learn spurious
      skill→personality-class associations instead of keeping the two
      signal sources (real skills from surveys, synthetic personality from
      O*NET) cleanly independent. Separation in these rows must come from
      personality features alone.
    * All 10 classes receive personality rows — unlike augment_profiles.py
      which targets only the 2 classes lacking real survey data. The
      personality gap affects every class equally (no survey measures it),
      so every class needs the signal.

Run (after preprocess_so.py and augment_profiles.py, before train.py):
    python augment_personality.py       # updates real_dataset_so.csv in place
    python train.py                     # auto-picks real_dataset_so.csv
"""

from __future__ import annotations
import os
import pandas as pd
from career_data import (
    FEATURE_ORDER, PERSONALITY, SKILLS, BASELINE,
    CAREER_LABELS, generate_dataset,
)

HERE = os.path.dirname(os.path.abspath(__file__))
DATASET_FILE = os.path.join(HERE, "real_dataset_so.csv")

# All 10 career classes get personality augmentation — the personality-trait
# gap (all zeros) is universal, not limited to specific classes.
AUGMENT_CLASSES = tuple(CAREER_LABELS)

# ── Row count justification ──────────────────────────────────────────────
# WARNING: a flat per-class count risks over-representing synthetic
# personality rows relative to smaller real classes. For context, the
# real-data class sizes vary widely (e.g. Frontend/Backend ~3000+ rows
# each from Stack Overflow, but Data Analyst/MLE may have only ~500-800
# real rows after deduplication). At 400 per class, the 10-class total
# is 4000 synthetic-personality rows — roughly 20-25% of the full dataset.
#
# Before committing to this number, check the class-distribution table
# that train.py prints after loading the dataset. If any real class has
# fewer rows than N_PER_CLASS, reduce N_PER_CLASS to the size of the
# smallest real class to avoid personality-synthetic rows dominating
# that class's training signal.
#
# Starting conservatively at 400 (not 1500 like augment_profiles.py)
# because personality rows exist for ALL 10 classes, so the total
# contribution (4000) is comparable to augment_profiles.py's total (3000).
N_PER_CLASS = 400
NOISE = 0.14           # same jitter as augment_profiles.py and the demo generator
SEED = 13              # different seed from augment_profiles.py (7) and default (42)

SOURCE_TAG = "synthetic-onet-personality"


def main() -> None:
    existing = pd.read_csv(DATASET_FILE)

    if "source" in existing.columns:
        # Re-running: drop previous personality-augmented rows so the script
        # is idempotent. Do NOT touch "real" or "synthetic-onet" rows.
        prev_count = (existing["source"] == SOURCE_TAG).sum()
        existing = existing[existing["source"] != SOURCE_TAG].copy()
        if prev_count:
            print(f"Dropped {prev_count} previous {SOURCE_TAG} rows (idempotent re-run).")
    else:
        existing["source"] = "real"

    # Sample noisy candidates around every O*NET profile with the shared
    # generator (same Gaussian-noise-and-clip technique used everywhere).
    synth = generate_dataset(n_per_class=N_PER_CLASS, noise=NOISE, seed=SEED)
    # Keep all 10 classes (personality gap is universal).
    synth = synth[synth["career"].isin(AUGMENT_CLASSES)].copy()

    # Zero the skill features (set to BASELINE) — the symmetric inverse of
    # augment_profiles.py zeroing personality traits. See module docstring
    # for why: nonzero skill values only in these rows would create
    # spurious skill→personality-class associations.
    for skill in SKILLS:
        synth[skill] = BASELINE

    synth["source"] = SOURCE_TAG

    merged = pd.concat(
        [existing[FEATURE_ORDER + ["career", "source"]],
         synth[FEATURE_ORDER + ["career", "source"]]],
        ignore_index=True,
    )

    print("\nClass distribution (real + synthetic-onet + synthetic-onet-personality):")
    dist = merged.groupby(["career", "source"]).size().unstack(fill_value=0)
    print(dist.to_string())

    merged.to_csv(DATASET_FILE, index=False)
    print(f"\nSaved {len(merged)} rows -> {DATASET_FILE}")
    real_n = (merged["source"] == "real").sum()
    onet_n = (merged["source"] == "synthetic-onet").sum()
    pers_n = (merged["source"] == SOURCE_TAG).sum()
    print(f"  ({real_n} real, {onet_n} synthetic-onet, {pers_n} {SOURCE_TAG})")


if __name__ == "__main__":
    main()
