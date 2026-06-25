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
# Kept low so that "not required" features don't pull all low-skill users
# toward the career with the fewest requirements (previously UI/UX).
BASELINE = 0.10

# --------------------------------------------------------------------------
# 2. CAREERS  (label -> ideal profile)
# Every career now has at least 3 strong technical signals so the model
# can separate them even when personality scores are similar.
# --------------------------------------------------------------------------

CAREERS: dict[str, dict[str, float]] = {
    "Data Scientist": {
        "analytical": 0.92, "problem_solving": 0.85, "creativity": 0.60,
        "communication": 0.55,
        "python": 0.92, "statistics": 0.92, "machine_learning": 0.88,
        "sql": 0.78, "data_visualization": 0.82,
    },
    "Machine Learning Engineer": {
        "analytical": 0.90, "problem_solving": 0.90, "creativity": 0.55,
        "python": 0.94, "machine_learning": 0.94, "statistics": 0.80,
        "backend_apis": 0.68, "cloud": 0.65, "linux_devops": 0.60,
    },
    "Data Analyst": {
        "analytical": 0.88, "communication": 0.78, "problem_solving": 0.65,
        "sql": 0.92, "statistics": 0.75, "data_visualization": 0.90,
        "python": 0.58, "databases": 0.60,
    },
    "Frontend Developer": {
        "creativity": 0.80, "problem_solving": 0.68, "communication": 0.60,
        "javascript": 0.92, "html_css": 0.92, "react": 0.90,
        "ui_ux_design": 0.65,
    },
    "Backend Developer": {
        "problem_solving": 0.85, "analytical": 0.78,
        "backend_apis": 0.92, "databases": 0.88, "sql": 0.82,
        "python": 0.72, "javascript": 0.58, "linux_devops": 0.55,
    },
    "Full Stack Developer": {
        "problem_solving": 0.82, "communication": 0.65, "analytical": 0.65,
        "javascript": 0.85, "html_css": 0.80, "react": 0.82,
        "backend_apis": 0.82, "databases": 0.75, "sql": 0.68,
    },
    "Cybersecurity Analyst": {
        "analytical": 0.88, "problem_solving": 0.85,
        "networking_security": 0.94, "linux_devops": 0.78,
        "python": 0.62, "databases": 0.55, "cloud": 0.55,
    },
    "Cloud / DevOps Engineer": {
        "problem_solving": 0.82, "analytical": 0.72,
        "cloud": 0.94, "linux_devops": 0.92, "networking_security": 0.70,
        "backend_apis": 0.65, "databases": 0.58, "python": 0.55,
    },
    "Mobile App Developer": {
        "creativity": 0.72, "problem_solving": 0.78,
        "mobile_dev": 0.94, "javascript": 0.70, "ui_ux_design": 0.62,
        "backend_apis": 0.58, "react": 0.55,
    },
    "UI/UX Designer": {
        "creativity": 0.94, "communication": 0.82, "teamwork": 0.72,
        "ui_ux_design": 0.94, "html_css": 0.68, "javascript": 0.52,
        "react": 0.50,
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
    n_per_class: int = 800,
    noise: float = 0.14,
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
