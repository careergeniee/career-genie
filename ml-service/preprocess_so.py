"""
preprocess_so.py
================
Builds a *genuinely real* training dataset from the Stack Overflow Annual
Developer Survey 2024 (official data: github.com/StackExchange/Survey,
packages/archive/2024/results.csv -- download it to data/so_2024_results.csv).

Why this replaces real_dataset.csv (the Kaggle CS-students file):
    A leakage audit showed the Kaggle pipeline copied each row's career label
    into its features (O*NET imputation + CAREER_FLOOR). With that leakage
    removed, accuracy collapsed to the majority-class baseline (22%) -- the
    Kaggle data contains no real skill->career signal at all.

What makes this dataset honest:
    * Label   = DevType, the respondent's ACTUAL current job (not aspiration).
    * Features = technologies the respondent ACTUALLY reported using.
    * No feature is ever derived from, floored by, or imputed from the label.

Known, documented limitations (kept deliberately -- do not "fix" by leaking):
    * The 6 personality traits + networking_security + ui_ux_design have no
      counterpart in the survey, so they are 0 for every row. The scaler
      zeroes them out and the forest never splits on them: they simply do not
      influence ML predictions (the in-app offline scorer still uses them).
    * Survey tech answers are binary have-used flags, while the app collects
      0-1 self-ratings. Random-forest splits handle this shift acceptably
      (a 0.7 self-rating lands on the same side as a 1.0 flag), but it is a
      distribution mismatch worth stating in the report.
    * Cybersecurity Analyst and UI/UX Designer have weak feature support and
      few rows -- expect (and report) lower per-class recall.

Run:
    python preprocess_so.py          # writes real_dataset_so.csv
    python train.py --data real_dataset_so.csv
"""

from __future__ import annotations
import os
import pandas as pd
from career_data import FEATURE_ORDER

HERE = os.path.dirname(os.path.abspath(__file__))
CSV_FILE = os.path.join(HERE, "data", "so_2024_results.csv")
OUT_FILE = os.path.join(HERE, "real_dataset_so.csv")

# Cap per class so 18k full-stack rows don't drown the small classes.
MAX_PER_CLASS = 4000
SEED = 42

# ---------------------------------------------------------------------------
# 1. DevType (actual current role) -> our 10 career labels.
#    Only unambiguous matches are kept; everything else is dropped.
# ---------------------------------------------------------------------------
ROLE_MAP: dict[str, str] = {
    "Data scientist or machine learning specialist": "Data Scientist",
    "Developer, AI":                                 "Machine Learning Engineer",
    "Data or business analyst":                      "Data Analyst",
    "Developer, front-end":                          "Frontend Developer",
    "Developer, back-end":                           "Backend Developer",
    "Developer, full-stack":                         "Full Stack Developer",
    "Security professional":                         "Cybersecurity Analyst",
    "DevOps specialist":                             "Cloud / DevOps Engineer",
    "Cloud infrastructure engineer":                 "Cloud / DevOps Engineer",
    "Engineer, site reliability":                    "Cloud / DevOps Engineer",
    "Developer, mobile":                             "Mobile App Developer",
    "Designer":                                      "UI/UX Designer",
}

# ---------------------------------------------------------------------------
# 2. Feature derivation -- ONLY from what the respondent reported using.
#    Multi-select survey columns are semicolon-separated tech lists.
# ---------------------------------------------------------------------------
LANGS   = "LanguageHaveWorkedWith"
WEB     = "WebframeHaveWorkedWith"
DB      = "DatabaseHaveWorkedWith"
PLAT    = "PlatformHaveWorkedWith"
TOOLS   = "ToolsTechHaveWorkedWith"
MISC    = "MiscTechHaveWorkedWith"
OPSYS   = "OpSysProfessional use"

BACKEND_FRAMEWORKS = {
    "Node.js", "Express", "ASP.NET CORE", "ASP.NET", "Flask", "Spring Boot",
    "Django", "FastAPI", "Laravel", "NestJS", "Ruby on Rails", "Fastify",
    "Phoenix", "Symfony", "CodeIgniter",
}
FRONTEND_FRAMEWORKS = {
    "React", "Next.js", "Vue.js", "Angular", "AngularJS", "Svelte",
    "Nuxt.js", "jQuery", "Astro", "Htmx", "Blazor",
}
CLOUD_PLATFORMS = {
    "Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud",
    "Oracle Cloud Infrastructure (OCI)", "IBM Cloud Or Watson",
    "Alibaba Cloud", "OpenStack", "OpenShift", "Digital Ocean", "Hetzner",
    "Linode, now Akamai", "Vultr", "Scaleway", "OVH",
}
DEVOPS_TOOLS = {"Docker", "Kubernetes", "Terraform", "Ansible", "Podman", "Nix"}
ML_TECH = {
    "TensorFlow", "Torch/PyTorch", "Scikit-Learn", "Keras",
    "Hugging Face Transformers", "Opencv", "CUDA",
}
STATS_TECH = {"NumPy", "Pandas", "Apache Spark", "Hadoop"}
STATS_LANGS = {"R", "Julia", "MATLAB"}
VIZ_SIGNALS = {"Pandas", "R"}            # closest the survey offers; weak proxy
MOBILE_LANGS = {"Swift", "Kotlin", "Dart", "Objective-C"}
MOBILE_TECH = {
    "Flutter", "React Native", "SwiftUI", "Xamarin", ".NET MAUI",
    "Ionic", "Cordova", "Capacitor",
}
LINUX_HINTS = ("Ubuntu", "Debian", "Arch", "Fedora", "Red Hat", "Other Linux-based")


def tech_set(row: pd.Series, col: str) -> set[str]:
    v = row.get(col)
    if pd.isna(v):
        return set()
    return {t.strip() for t in str(v).split(";")}


def graded(n_hits: int, saturate_at: int = 2) -> float:
    """0 hits -> 0.0; saturate_at or more hits -> 1.0 (linear in between)."""
    return min(1.0, n_hits / saturate_at)


def build_row(row: pd.Series) -> dict[str, float]:
    langs = tech_set(row, LANGS)
    web   = tech_set(row, WEB)
    dbs   = tech_set(row, DB)
    plats = tech_set(row, PLAT)
    tools = tech_set(row, TOOLS)
    misc  = tech_set(row, MISC)
    opsys = str(row.get(OPSYS, ""))

    out = {f: 0.0 for f in FEATURE_ORDER}  # traits & unsupported features stay 0
    out["python"]             = 1.0 if "Python" in langs else 0.0
    out["javascript"]         = 1.0 if {"JavaScript", "TypeScript"} & langs else 0.0
    out["sql"]                = 1.0 if "SQL" in langs else 0.0
    out["html_css"]           = 1.0 if "HTML/CSS" in langs else 0.0
    out["react"]              = graded(len({"React", "Next.js", "React Native"} & (web | misc)), 1)
    out["backend_apis"]       = graded(len(BACKEND_FRAMEWORKS & web))
    out["databases"]          = graded(len(dbs), 3)
    out["cloud"]              = graded(len(CLOUD_PLATFORMS & plats))
    out["linux_devops"]       = 0.6 * graded(len(DEVOPS_TOOLS & tools)) + \
                                0.4 * (1.0 if any(h in opsys for h in LINUX_HINTS) else 0.0)
    out["machine_learning"]   = graded(len(ML_TECH & misc))
    out["statistics"]         = graded(len(STATS_TECH & misc) + len(STATS_LANGS & langs))
    out["data_visualization"] = graded(len(VIZ_SIGNALS & (misc | langs)))
    out["mobile_dev"]         = graded(len(MOBILE_LANGS & langs) + len(MOBILE_TECH & misc))
    # A rough "frontend breadth" boost for html_css via frameworks, still label-free:
    if FRONTEND_FRAMEWORKS & web:
        out["html_css"] = max(out["html_css"], 0.7)
    return out


def main() -> None:
    print(f"Loading {CSV_FILE} ...")
    usecols = ["MainBranch", "DevType", LANGS, WEB, DB, PLAT, TOOLS, MISC, OPSYS]
    df = pd.read_csv(CSV_FILE, usecols=usecols, low_memory=False)
    print(f"  Raw rows: {len(df)}")

    # Professionals only: the label must be an actual job, not a student goal.
    df = df[df["MainBranch"] == "I am a developer by profession"]
    df["career"] = df["DevType"].map(ROLE_MAP)
    df = df.dropna(subset=["career"])
    print(f"  Professional rows with a mapped role: {len(df)}")

    records = []
    for _, row in df.iterrows():
        feats = build_row(row)
        # Drop rows with no tech signal at all (respondent skipped tech sections).
        if sum(feats.values()) == 0.0:
            continue
        feats["career"] = row["career"]
        records.append(feats)
    out = pd.DataFrame(records)[FEATURE_ORDER + ["career"]]
    print(f"  Rows with usable tech answers: {len(out)}")

    # Cap the giant classes so training isn't 50% full-stack.
    out = pd.concat([
        g.sample(min(len(g), MAX_PER_CLASS), random_state=SEED)
        for _, g in out.groupby("career")
    ], ignore_index=True)

    print("\n  Final class distribution:")
    print(out["career"].value_counts().to_string())
    out.to_csv(OUT_FILE, index=False)
    print(f"\nSaved {len(out)} rows -> {OUT_FILE}")


if __name__ == "__main__":
    main()
