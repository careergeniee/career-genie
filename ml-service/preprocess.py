"""
preprocess.py
=============
Maps computer_science_student_career_datasetMar62024.csv to CareerGenie's
21-feature schema and saves real_dataset.csv ready for train.py.

Run:
    python preprocess.py
"""

from __future__ import annotations
import pandas as pd
import numpy as np
from career_data import FEATURE_ORDER, CAREERS, BASELINE

CSV_FILE = "computer_science_student_career_datasetMar62024.csv"
OUT_FILE = "real_dataset.csv"

# ---------------------------------------------------------------------------
# 1. Map dataset career labels -> our 10 career labels
#    Only careers that genuinely match are kept; the rest are dropped.
# ---------------------------------------------------------------------------
CAREER_MAP: dict[str, str] = {
    "Data Scientist":                        "Data Scientist",
    "Machine Learning Engineer":             "Machine Learning Engineer",
    "Artificial Intelligence Engineer":      "Machine Learning Engineer",
    "Business Intelligence Analyst":         "Data Analyst",
    "Front End Developer":                   "Frontend Developer",
    "Web Developer":                         "Frontend Developer",
    "Back End Developer":                    "Backend Developer",
    "Software Developer":                    "Backend Developer",
    "Software Engineer":                     "Backend Developer",
    "Database Administrator":                "Backend Developer",
    "Full Stack Developer":                  "Full Stack Developer",
    "Cybersecurity Analyst":                 "Cybersecurity Analyst",
    "Network Administrator":                 "Cybersecurity Analyst",
    "DevOps Engineer":                       "Cloud / DevOps Engineer",
    "Cloud Architect":                       "Cloud / DevOps Engineer",
    "Computer Network Architect":            "Cloud / DevOps Engineer",
    "Mobile App Developer":                  "Mobile App Developer",
    "UI/UX Designer":                        "UI/UX Designer",
}

# ---------------------------------------------------------------------------
# 2. Map dataset columns -> our feature names
#    Unmapped features are imputed from the O*NET career profile (see below).
# ---------------------------------------------------------------------------
DIRECT_MAP: dict[str, str] = {
    # Personality / soft skills
    "Communication_Skills":      "communication",
    "Problem_Solving_Abilities": "problem_solving",
    "Teamwork_Collaboration":    "teamwork",
    "Adaptability":              "creativity",   # best proxy available

    # Technical skills (direct matches)
    "Python":                    "python",
    "JavaScript":                "javascript",
    "Database_Management":       "sql",          # SQL knowledge = DB management
    "Networking_Skills":         "networking_security",
    "Swift":                     "mobile_dev",   # Swift = iOS/mobile dev
}

# Derived features built from combinations of columns
def derive_features(row: pd.Series) -> dict[str, float]:
    """Compute features that have no single matching column."""
    return {
        # Leadership: Yes/No binary column
        "leadership":     1.0 if str(row.get("Leadership_Experience", "No")).strip() == "Yes" else 0.2,
        # Analytical: GPA normalised to 0-1 (GPA range 0-4)
        "analytical":     float(row.get("GPA", 2.0)) / 4.0,
        # React: JS skill + web experience weighted
        "react":          (float(row.get("JavaScript", 0)) * 0.6 +
                           float(row.get("Web_Development_Experience", 0)) * 0.4) / 9.0,
        # HTML/CSS: web dev experience is the best proxy
        "html_css":       float(row.get("Web_Development_Experience", 0)) / 9.0,
        # Backend APIs: software development experience
        "backend_apis":   float(row.get("Software_Development_Experience", 0)) / 9.0,
        # Databases: same as DB management (alias)
        "databases":      float(row.get("Database_Management", 0)) / 9.0,
        # Linux/DevOps: blend of software dev + networking
        "linux_devops":   (float(row.get("Software_Development_Experience", 0)) * 0.5 +
                           float(row.get("Networking_Skills", 0)) * 0.5) / 9.0,
        # UI/UX: web experience + adaptability/creativity
        "ui_ux_design":   (float(row.get("Web_Development_Experience", 0)) * 0.5 +
                           float(row.get("Adaptability", 0)) * 0.5) / 9.0,
    }


def onet_impute(feature: str, career: str) -> float:
    """For features not derivable from the dataset, use O*NET career profile."""
    profile = CAREERS.get(career, {})
    return profile.get(feature, BASELINE)


def normalise(val: float, scale: float = 9.0) -> float:
    return min(1.0, max(0.0, float(val) / scale))


# Career-specific minimum values for the most distinctive feature of each
# career. When the dataset's proxy column under-represents a key skill
# (e.g. Swift doesn't fully capture mobile dev expertise), we use the
# career goal itself as a signal to floor the value.
CAREER_FLOOR: dict[str, dict[str, float]] = {
    "Mobile App Developer":    {"mobile_dev": 0.75},
    "UI/UX Designer":          {"ui_ux_design": 0.78, "creativity": 0.80},
    "Cloud / DevOps Engineer": {"cloud": 0.80, "linux_devops": 0.75},
    "Cybersecurity Analyst":   {"networking_security": 0.78},
    "Data Scientist":          {"statistics": 0.75, "machine_learning": 0.70},
    "Machine Learning Engineer": {"machine_learning": 0.80, "python": 0.75},
    "Data Analyst":            {"sql": 0.75, "data_visualization": 0.72},
}


def build_row(raw: pd.Series, career: str) -> dict[str, float]:
    out: dict[str, float] = {}

    # Direct mappings (all on 0-9 scale)
    for csv_col, feature in DIRECT_MAP.items():
        if csv_col in raw.index:
            out[feature] = normalise(raw[csv_col])

    # Derived features
    out.update(derive_features(raw))

    # Remaining features: impute from O*NET profile for this career
    for feature in FEATURE_ORDER:
        if feature not in out:
            out[feature] = onet_impute(feature, career)

    # Apply career-specific floors so key distinguishing features are
    # never under-represented due to weak proxy columns in the dataset.
    for feature, floor_val in CAREER_FLOOR.get(career, {}).items():
        out[feature] = max(out.get(feature, 0.0), floor_val)

    return out


def main() -> None:
    print(f"Loading {CSV_FILE} ...")
    df = pd.read_csv(CSV_FILE)
    print(f"  Raw shape: {df.shape}")

    # Map career labels
    df["career"] = df["Career_Goals"].map(CAREER_MAP)
    before = len(df)
    df = df.dropna(subset=["career"])
    print(f"  Kept {len(df)} / {before} rows after career mapping")
    print(f"\n  Career distribution:")
    print(df["career"].value_counts().to_string())

    # Build feature rows
    records = []
    for _, row in df.iterrows():
        career = row["career"]
        feat = build_row(row, career)
        feat["career"] = career
        records.append(feat)

    out = pd.DataFrame(records)
    cols = FEATURE_ORDER + ["career"]
    out = out[cols]

    # Clip everything to [0, 1]
    for f in FEATURE_ORDER:
        out[f] = out[f].clip(0.0, 1.0)

    out.to_csv(OUT_FILE, index=False)
    print(f"\nSaved {len(out)} rows -> {OUT_FILE}")
    print(f"Features: {FEATURE_ORDER}")
    print("\nRun next: python train.py --data real_dataset.csv")


if __name__ == "__main__":
    main()
