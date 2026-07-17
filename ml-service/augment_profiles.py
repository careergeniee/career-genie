"""
augment_profiles.py
===================
Adds SYNTHETIC rows for the two classes no real survey can support --
Cybersecurity Analyst and UI/UX Designer -- to real_dataset_so.csv.

Why synthetic here, after this project spent so much effort removing fake
signal: every real developer survey (SO 2022-2024, Kaggle 2020) lacks the
features that distinguish these roles (nobody asks about security tooling
or design tools), so their rows are indistinguishable from DevOps/Frontend
rows and the model scored F1 0.00 on both. The app, however, DOES collect
`networking_security` and `ui_ux_design` self-ratings -- the product needs
the model to map those ratings to these careers.

The synthetic rows encode that mapping from the O*NET occupational profiles
in career_data.py (US Dept. of Labor data: SOC 15-1212.00 Information
Security Analysts, SOC 15-1255.00 Web & Digital Interface Designers),
sampled with Gaussian noise by the same generate_dataset() used for the
project's original demo data.

Honesty rules for this augmentation:
    * FULL DISCLOSURE: every synthetic row carries source="synthetic-onet"
      (real rows are tagged source="real"), and train.py reports metrics on
      the real-only test subset separately. The per-class scores for these
      two classes measure "does the model recover the documented O*NET
      profile", NOT real-world accuracy -- there is no real ground truth
      for them. Say exactly that in any report.
    * The 6 personality traits are ZEROED in synthetic rows to match every
      real row (real surveys don't measure traits either). Otherwise traits
      would be nonzero only for these 2 classes and the model would learn
      "any personality signal => Designer/Security", skewing predictions
      for every user. Separation must come from the skill features alone.
    * Only these two classes are augmented. The 8 real-data classes stay
      100% real.

Run (after preprocess_so.py + preprocess_kaggle_*.py):
    python augment_profiles.py         # updates real_dataset_so.csv in place
    python train.py --data real_dataset_so.csv
"""

from __future__ import annotations
import os
import pandas as pd
from career_data import FEATURE_ORDER, PERSONALITY, generate_dataset

HERE = os.path.dirname(os.path.abspath(__file__))
DATASET_FILE = os.path.join(HERE, "real_dataset_so.csv")

AUGMENT_CLASSES = ("Cybersecurity Analyst", "UI/UX Designer")
N_PER_CLASS = 1500     # comparable to the other minority classes (DA/MLE)
NOISE = 0.14           # same jitter the original demo generator used
SEED = 7


def main() -> None:
    existing = pd.read_csv(DATASET_FILE)
    if "source" in existing.columns:
        # Re-running: drop previous synthetic rows so the script is idempotent.
        existing = existing[existing["source"] != "synthetic-onet"].copy()
    else:
        existing["source"] = "real"

    # Sample noisy candidates around every O*NET profile with the shared
    # generator, then keep only the two classes real data cannot cover.
    synth = generate_dataset(n_per_class=N_PER_CLASS, noise=NOISE, seed=SEED)
    synth = synth[synth["career"].isin(AUGMENT_CLASSES)].copy()

    # Zero the personality traits to match every real row (see module docstring).
    for trait in PERSONALITY:
        synth[trait] = 0.0
    synth["source"] = "synthetic-onet"

    merged = pd.concat(
        [existing[FEATURE_ORDER + ["career", "source"]],
         synth[FEATURE_ORDER + ["career", "source"]]],
        ignore_index=True,
    )

    print("Class distribution (real + synthetic):")
    dist = merged.groupby(["career", "source"]).size().unstack(fill_value=0)
    print(dist.to_string())
    merged.to_csv(DATASET_FILE, index=False)
    print(f"\nSaved {len(merged)} rows -> {DATASET_FILE}")
    print(f"  ({(merged['source'] == 'real').sum()} real, "
          f"{(merged['source'] == 'synthetic-onet').sum()} synthetic)")


if __name__ == "__main__":
    main()
