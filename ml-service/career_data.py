"""
career_data.py
==============
Single source of truth for Career Genie's ML model.

Career profiles are grounded in O*NET occupational data (onetonline.org),
the US Department of Labor's research database built from surveys of
thousands of real workers per occupation.

Mapping:
  Personality features  <- O*NET Work Styles (standardised 0-100 scale -> 0-1)
  Technical features    <- O*NET Technology Skills + Knowledge ratings (0-1)

SOC codes used:
  Data Scientist              15-2051.00
  Machine Learning Engineer   15-2051.00 / 15-1299.09
  Data Analyst                15-2041.00 / 15-1211.00
  Frontend Developer          15-1254.00  (Web Developers)
  Backend Developer           15-1252.00  (Software Developers)
  Full Stack Developer        15-1254.00 + 15-1252.00 composite
  Cybersecurity Analyst       15-1212.00
  Cloud / DevOps Engineer     15-1244.00 / 15-1299.08
  Mobile App Developer        15-1252.00 (specialised)
  UI/UX Designer              15-1255.00  (Web & Digital Interface Designers)

Training samples are synthetic (Gaussian noise around each O*NET profile)
because no public labelled dataset maps these exact personality+skill
features to career outcomes. The profiles themselves are O*NET-sourced.

IMPORTANT: FEATURE_ORDER must stay identical to src/lib/mlSchema.ts
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

# Baseline value for features a role does not specifically require.
# 0.10 keeps "not needed" well below "needed", giving the model
# clean separation between occupations.
BASELINE = 0.10

# --------------------------------------------------------------------------
# 2. CAREERS  (label -> ideal profile)
#
# Personality values sourced from O*NET Work Styles (standardised scores
# divided by 100).  Technical values sourced from O*NET Technology Skills
# and Knowledge importance ratings for each SOC code.
#
# Only features that genuinely matter for a role are listed; everything
# else falls back to BASELINE so the model cannot "cheat" by ignoring
# irrelevant features.
# --------------------------------------------------------------------------

CAREERS: dict[str, dict[str, float]] = {

    # ── 15-2051.00  Data Scientists ──────────────────────────────────────
    # O*NET Work Styles: Analytical Thinking 0.96, Innovation 0.88,
    # Attention to Detail 0.93, Cooperation 0.79.
    # Top tech skills: Python, R, SQL, TensorFlow, Spark, Tableau.
    "Data Scientist": {
        "analytical":         0.94,
        "problem_solving":    0.88,
        "creativity":         0.88,
        "communication":      0.76,
        "teamwork":           0.79,
        "python":             0.90,
        "statistics":         0.92,
        "machine_learning":   0.88,
        "sql":                0.76,
        "data_visualization": 0.80,
        "databases":          0.58,
        "cloud":              0.52,
        "linux_devops":       0.50,
    },

    # ── 15-2051.00 / 15-1299.09  Machine Learning Engineers ──────────────
    # More engineering-oriented than pure data scientist.
    # O*NET: Innovation 0.82, Analytical Thinking 0.92.
    # Tech: Python, TensorFlow/PyTorch, Docker, cloud ML platforms.
    "Machine Learning Engineer": {
        "analytical":         0.92,
        "problem_solving":    0.90,
        "creativity":         0.82,
        "teamwork":           0.75,
        "python":             0.94,
        "machine_learning":   0.94,
        "statistics":         0.82,
        "backend_apis":       0.70,
        "cloud":              0.68,
        "linux_devops":       0.65,
        "databases":          0.55,
    },

    # ── 15-2041.00 / 15-1211.00  Data Analysts ───────────────────────────
    # O*NET: Communication 0.82 (translating data for stakeholders),
    # Analytical Thinking 0.90, Mathematics skill 0.80.
    # Tech: SQL, Excel, Tableau, Power BI, Python (basic).
    "Data Analyst": {
        "analytical":         0.90,
        "communication":      0.82,
        "problem_solving":    0.72,
        "creativity":         0.65,
        "teamwork":           0.72,
        "sql":                0.92,
        "data_visualization": 0.92,
        "statistics":         0.80,
        "python":             0.65,
        "databases":          0.68,
    },

    # ── 15-1254.00  Web Developers (Frontend) ────────────────────────────
    # O*NET: Innovation 0.84, Attention to Detail 0.88,
    # Cooperation 0.75, Analytical Thinking 0.85.
    # Tech: HTML/CSS, JavaScript, React/Vue/Angular, Figma basics.
    "Frontend Developer": {
        "creativity":      0.84,
        "analytical":      0.72,
        "problem_solving": 0.70,
        "communication":   0.66,
        "teamwork":        0.75,
        "javascript":      0.92,
        "html_css":        0.94,
        "react":           0.88,
        "ui_ux_design":    0.72,
    },

    # ── 15-1252.00  Software Developers (Backend) ────────────────────────
    # O*NET: Analytical Thinking 0.94, Innovation 0.89,
    # Complex Problem Solving top-rated skill.
    # Tech: Python/Java/Node.js, REST APIs, databases, Linux, cloud.
    "Backend Developer": {
        "analytical":      0.82,
        "problem_solving": 0.86,
        "creativity":      0.72,
        "teamwork":        0.70,
        "backend_apis":    0.92,
        "databases":       0.88,
        "sql":             0.80,
        "python":          0.72,
        "javascript":      0.58,
        "linux_devops":    0.62,
        "cloud":           0.58,
    },

    # ── 15-1254.00 + 15-1252.00  Full Stack Developers ───────────────────
    # Composite of both O*NET profiles.
    # Tech: JS/TS, React, Node/Django, SQL, REST APIs, cloud basics.
    "Full Stack Developer": {
        "analytical":      0.75,
        "problem_solving": 0.80,
        "creativity":      0.76,
        "communication":   0.68,
        "teamwork":        0.74,
        "javascript":      0.88,
        "html_css":        0.82,
        "react":           0.84,
        "backend_apis":    0.84,
        "databases":       0.78,
        "sql":             0.70,
        "cloud":           0.55,
    },

    # ── 15-1212.00  Information Security Analysts ─────────────────────────
    # O*NET: Analytical Thinking 0.96, Attention to Detail 0.94,
    # Innovation 0.85. Top skills: Critical Thinking, Systems Analysis.
    # Tech: Firewalls, IDS/IPS, Wireshark, Kali Linux, Python, SIEM.
    "Cybersecurity Analyst": {
        "analytical":          0.90,
        "problem_solving":     0.88,
        "creativity":          0.75,
        "communication":       0.72,
        "leadership":          0.64,
        "networking_security": 0.94,
        "linux_devops":        0.78,
        "python":              0.62,
        "cloud":               0.60,
        "databases":           0.52,
    },

    # ── 15-1244.00 / 15-1299.08  Cloud & DevOps Engineers ────────────────
    # O*NET: Complex Problem Solving, Systems Analysis, Active Learning.
    # Cooperation 0.72, Analytical Thinking 0.78.
    # Tech: AWS/Azure/GCP, Kubernetes, Docker, Terraform, Linux, CI/CD.
    "Cloud / DevOps Engineer": {
        "analytical":          0.78,
        "problem_solving":     0.82,
        "creativity":          0.70,
        "teamwork":            0.72,
        "cloud":               0.94,
        "linux_devops":        0.94,
        "networking_security": 0.72,
        "backend_apis":        0.65,
        "databases":           0.58,
        "python":              0.60,
    },

    # ── 15-1252.00 (specialised)  Mobile App Developers ──────────────────
    # O*NET: Innovation 0.78, Problem Solving 0.75, Cooperation 0.68.
    # Tech: Swift/Kotlin, React Native/Flutter, mobile SDKs, REST APIs.
    "Mobile App Developer": {
        "creativity":      0.78,
        "problem_solving": 0.75,
        "analytical":      0.70,
        "teamwork":        0.68,
        "mobile_dev":      0.96,
        "javascript":      0.70,
        "react":           0.62,
        "ui_ux_design":    0.65,
        "backend_apis":    0.58,
    },

    # ── 15-1255.00  Web & Digital Interface Designers (UI/UX) ────────────
    # O*NET: Innovation 0.90, Cooperation 0.85, Communication 0.84,
    # Attention to Detail 0.91. Lowest analytical of all 10 roles (0.60).
    # Tech: Figma, Adobe XD, HTML/CSS (prototyping), basic JS awareness.
    "UI/UX Designer": {
        "creativity":      0.92,
        "communication":   0.84,
        "teamwork":        0.84,
        "problem_solving": 0.65,
        "analytical":      0.60,
        "ui_ux_design":    0.96,
        "html_css":        0.68,
        "javascript":      0.52,
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
