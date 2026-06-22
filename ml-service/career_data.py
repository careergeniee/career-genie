"""
career_data.py
==============
Single source of truth for Career Genie's ML model.

It defines:
  * the FEATURE vector (personality traits + self-rated skills),
  * the CAREER catalogue, each described by an "ideal profile",
  * a synthetic-dataset generator used to train the Random Forest.

Why synthetic data?  No public, labelled "personality+skills -> career"
dataset exists at the granularity this project needs. So, following common
practice for FYP / prototype ML systems, we encode domain knowledge about
what each role actually requires into an ideal profile, then sample noisy
candidates around those profiles. The Random Forest then *learns* the
decision boundaries between roles from data rather than us hard-coding them.

IMPORTANT: the FEATURE order here must stay identical to the TypeScript
copy in  src/lib/mlSchema.ts  so the browser builds the exact same vector
the model was trained on.
"""

from __future__ import annotations
import numpy as np
import pandas as pd

# --------------------------------------------------------------------------
# 1. FEATURES  (order matters — mirrored in src/lib/mlSchema.ts)
# --------------------------------------------------------------------------

PERSONALITY = [
    "leadership",
    "creativity",
    "communication",
    "problem_solving",
    "analytical",
    "teamwork",
]

SKILLS = [
    "python",
    "javascript",
    "sql",
    "statistics",
    "machine_learning",
    "data_visualization",
    "html_css",
    "react",
    "backend_apis",
    "databases",
    "cloud",
    "networking_security",
    "linux_devops",
    "mobile_dev",
    "ui_ux_design",
]

FEATURE_ORDER = PERSONALITY + SKILLS  # 21 features, all scaled 0..1

# Baseline value for any feature a role does not care about.
BASELINE = 0.22

# --------------------------------------------------------------------------
# 2. CAREERS  (label -> ideal profile)
# Only the features that matter for a role are listed; the rest fall back
# to BASELINE. Values are the "ideal" 0..1 level a strong candidate shows.
# --------------------------------------------------------------------------

CAREERS: dict[str, dict[str, float]] = {
    "Data Scientist": {
        "analytical": 0.90, "problem_solving": 0.85, "creativity": 0.55,
        "python": 0.90, "statistics": 0.90, "machine_learning": 0.85,
        "sql": 0.75, "data_visualization": 0.80,
    },
    "Machine Learning Engineer": {
        "analytical": 0.88, "problem_solving": 0.88,
        "python": 0.92, "machine_learning": 0.92, "statistics": 0.78,
        "backend_apis": 0.65, "cloud": 0.60, "linux_devops": 0.55,
    },
    "Data Analyst": {
        "analytical": 0.85, "communication": 0.70,
        "sql": 0.88, "statistics": 0.72, "data_visualization": 0.88,
        "python": 0.55,
    },
    "Frontend Developer": {
        "creativity": 0.75, "problem_solving": 0.65,
        "javascript": 0.88, "html_css": 0.90, "react": 0.88,
        "ui_ux_design": 0.55,
    },
    "Backend Developer": {
        "problem_solving": 0.80, "analytical": 0.70,
        "backend_apis": 0.90, "databases": 0.85, "sql": 0.78,
        "python": 0.55, "javascript": 0.55,
    },
    "Full Stack Developer": {
        "problem_solving": 0.78, "communication": 0.62,
        "javascript": 0.82, "html_css": 0.78, "react": 0.80,
        "backend_apis": 0.80, "databases": 0.72, "sql": 0.65,
    },
    "Cybersecurity Analyst": {
        "analytical": 0.82, "problem_solving": 0.80,
        "networking_security": 0.92, "linux_devops": 0.70,
        "python": 0.55, "databases": 0.50,
    },
    "Cloud / DevOps Engineer": {
        "problem_solving": 0.78, "analytical": 0.68,
        "cloud": 0.90, "linux_devops": 0.90, "networking_security": 0.65,
        "backend_apis": 0.60, "databases": 0.55,
    },
    "Mobile App Developer": {
        "creativity": 0.68, "problem_solving": 0.72,
        "mobile_dev": 0.92, "javascript": 0.65, "ui_ux_design": 0.55,
        "backend_apis": 0.55,
    },
    "UI/UX Designer": {
        "creativity": 0.92, "communication": 0.75, "teamwork": 0.68,
        "ui_ux_design": 0.92, "html_css": 0.55,
    },
}

CAREER_LABELS = list(CAREERS.keys())


def ideal_vector(profile: dict[str, float]) -> np.ndarray:
    """Expand a sparse role profile into the full ordered feature vector."""
    return np.array(
        [profile.get(f, BASELINE) for f in FEATURE_ORDER], dtype=float
    )


# --------------------------------------------------------------------------
# 3. SYNTHETIC DATASET GENERATOR
# --------------------------------------------------------------------------

def generate_dataset(
    n_per_class: int = 600,
    noise: float = 0.16,
    seed: int = 42,
) -> pd.DataFrame:
    """
    Build a labelled dataset by sampling noisy candidates around each
    career's ideal profile.

    For every sample we jitter each feature with Gaussian noise, clip to
    [0, 1], and occasionally damp a few "strong" skills (real candidates
    are rarely perfect across the board). This produces overlapping but
    separable clusters — exactly what a Random Forest is good at.
    """
    rng = np.random.default_rng(seed)
    rows, labels = [], []

    for label, profile in CAREERS.items():
        base = ideal_vector(profile)
        for _ in range(n_per_class):
            sample = base + rng.normal(0, noise, size=base.shape)

            # Damp 0-3 random features so no candidate is "perfect".
            k = rng.integers(0, 4)
            if k:
                idx = rng.choice(len(sample), size=k, replace=False)
                sample[idx] *= rng.uniform(0.4, 0.8, size=k)

            rows.append(np.clip(sample, 0.0, 1.0))
            labels.append(label)

    df = pd.DataFrame(rows, columns=FEATURE_ORDER)
    df["career"] = labels
    # Shuffle so classes aren't grouped.
    return df.sample(frac=1.0, random_state=seed).reset_index(drop=True)


if __name__ == "__main__":
    d = generate_dataset()
    print(d.shape)
    print(d["career"].value_counts())
    print(d.head())
