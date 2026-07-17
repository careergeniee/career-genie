"""
preprocess_so.py
================
Builds a *genuinely real* training dataset from the official Stack Overflow
Annual Developer Survey — now merging THREE years (2024, 2023, 2022) from
github.com/StackExchange/Survey (packages/archive/<year>/results.csv,
download to data/so_<year>_results.csv; see README "Retrain from scratch").

Why multiple years: single-year 2024 left the rare classes starved
(Data Analyst 178, Cybersecurity 133, UI/UX Designer 46 rows). Different
survey years are different respondents, so merging them multiplies the
real rows for those classes without any synthetic data.

What makes this dataset honest:
    * Label   = DevType, the respondent's ACTUAL current job (professionals
      only). 2022 was multi-select: rows are kept only when every selected
      role maps to the same single career label; ambiguous rows are dropped.
    * Features = technologies the respondent ACTUALLY reported using.
      Tech names are normalized across years (e.g. 2022 "AWS" == 2024
      "Amazon Web Services (AWS)") case-insensitively via SYNONYMS.
    * No feature is ever derived from, floored by, or imputed from the label.

Known, documented limitations (kept deliberately -- do not "fix" by leaking):
    * "Developer, AI" (-> Machine Learning Engineer) exists only since 2024;
      earlier surveys folded MLEs into the Data Scientist category, so the
      MLE class cannot be honestly grown from older years.
    * The 6 personality traits + networking_security + ui_ux_design have no
      counterpart in any survey year: they stay 0 in training and the model
      ignores them (the in-app offline scorer still uses them).
    * Survey tech answers are binary have-used flags; the app sends 0-1
      self-ratings. A tolerable but real train/serve distribution shift.

Run:
    python preprocess_so.py          # writes real_dataset_so.csv
    python train.py --data real_dataset_so.csv
"""

from __future__ import annotations
import os
import pandas as pd
from career_data import FEATURE_ORDER

HERE = os.path.dirname(os.path.abspath(__file__))
YEARS = (2024, 2023, 2022)
OUT_FILE = os.path.join(HERE, "real_dataset_so.csv")

# Cap per class so 40k+ backend/full-stack rows don't drown the small classes.
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
#    All matching is done on lowercased tokens run through SYNONYMS, so the
#    same technology counts identically across survey years.
# ---------------------------------------------------------------------------
LANGS   = "LanguageHaveWorkedWith"
WEB     = "WebframeHaveWorkedWith"
DB      = "DatabaseHaveWorkedWith"
PLAT    = "PlatformHaveWorkedWith"
TOOLS   = "ToolsTechHaveWorkedWith"
MISC    = "MiscTechHaveWorkedWith"
OPSYS   = "OpSysProfessional use"
USECOLS = ["MainBranch", "DevType", LANGS, WEB, DB, PLAT, TOOLS, MISC, OPSYS]

# Older-year name -> canonical (2024) name, all lowercase.
SYNONYMS: dict[str, str] = {
    "aws":                          "amazon web services (aws)",
    "digitalocean":                 "digital ocean",
    "oracle cloud infrastructure":  "oracle cloud infrastructure (oci)",
    "linode":                       "linode, now akamai",
    "spring":                       "spring framework",
    "asp.net core":                 "asp.net core",   # case unified by lowering
}


def canon(token: str) -> str:
    t = token.strip().lower()
    return SYNONYMS.get(t, t)


def lower_set(*names: str) -> set[str]:
    return {canon(n) for n in names}


BACKEND_FRAMEWORKS = lower_set(
    "Node.js", "Express", "ASP.NET CORE", "ASP.NET", "Flask", "Spring Boot",
    "Django", "FastAPI", "Laravel", "NestJS", "Ruby on Rails", "Fastify",
    "Phoenix", "Symfony", "CodeIgniter",
)
FRONTEND_FRAMEWORKS = lower_set(
    "React", "Next.js", "Vue.js", "Angular", "AngularJS", "Svelte",
    "Nuxt.js", "jQuery", "Astro", "Htmx", "Blazor",
)
CLOUD_PLATFORMS = lower_set(
    "Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud",
    "Oracle Cloud Infrastructure (OCI)", "IBM Cloud Or Watson",
    "Alibaba Cloud", "OpenStack", "OpenShift", "Digital Ocean", "Hetzner",
    "Linode, now Akamai", "Vultr", "Scaleway", "OVH",
)
DEVOPS_TOOLS = lower_set("Docker", "Kubernetes", "Terraform", "Ansible", "Podman", "Nix",
                         "Pulumi", "Puppet", "Chef")
ML_TECH = lower_set(
    "TensorFlow", "Torch/PyTorch", "Scikit-Learn", "Keras",
    "Hugging Face Transformers", "Opencv", "CUDA", "JAX",
)
STATS_TECH = lower_set("NumPy", "Pandas", "Apache Spark", "Hadoop", "Tidyverse")
STATS_LANGS = lower_set("R", "Julia", "MATLAB", "SAS")
VIZ_SIGNALS = lower_set("Pandas", "R", "Tidyverse")   # closest the survey offers; weak proxy
MOBILE_LANGS = lower_set("Swift", "Kotlin", "Dart", "Objective-C")
MOBILE_TECH = lower_set(
    "Flutter", "React Native", "SwiftUI", "Xamarin", ".NET MAUI",
    "Ionic", "Cordova", "Capacitor",
)
REACT_TECH = lower_set("React", "Next.js", "React Native")
JS_LANGS = lower_set("JavaScript", "TypeScript")
LINUX_HINTS = ("ubuntu", "debian", "arch", "fedora", "red hat", "other linux-based")


def tech_set(row: pd.Series, col: str) -> set[str]:
    v = row.get(col)
    if pd.isna(v):
        return set()
    return {canon(t) for t in str(v).split(";")}


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
    opsys = str(row.get(OPSYS, "")).lower()

    out = {f: 0.0 for f in FEATURE_ORDER}  # traits & unsupported features stay 0
    out["python"]             = 1.0 if "python" in langs else 0.0
    out["javascript"]         = 1.0 if JS_LANGS & langs else 0.0
    out["sql"]                = 1.0 if "sql" in langs else 0.0
    out["html_css"]           = 1.0 if "html/css" in langs else 0.0
    out["react"]              = graded(len(REACT_TECH & (web | misc)), 1)
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


def map_devtype(devtype: str) -> str | None:
    """
    Map a DevType cell to exactly one career label, or None.
    Handles multi-select years (2022): every selected role that appears in
    ROLE_MAP must agree on one label; if the roles map to two different
    labels (e.g. "Developer, front-end;Designer") the row is ambiguous and
    dropped. Roles not in ROLE_MAP (e.g. "Engineering manager") make the
    row ambiguous too -- the person's actual job includes work we don't model.
    """
    if pd.isna(devtype):
        return None
    parts = [p.strip() for p in str(devtype).split(";") if p.strip()]
    if not parts:
        return None
    mapped = {ROLE_MAP.get(p) for p in parts}
    if None in mapped or len(mapped) != 1:
        return None
    return mapped.pop()


def load_year(year: int) -> pd.DataFrame:
    path = os.path.join(HERE, "data", f"so_{year}_results.csv")
    print(f"Loading {path} ...")
    df = pd.read_csv(path, usecols=lambda c: c in USECOLS, low_memory=False)
    df = df[df["MainBranch"] == "I am a developer by profession"]
    df["career"] = df["DevType"].map(map_devtype)
    df = df.dropna(subset=["career"])
    print(f"  {year}: {len(df)} professional rows with an unambiguous mapped role")
    return df


def main() -> None:
    frames = [load_year(y) for y in YEARS]
    df = pd.concat(frames, ignore_index=True)

    records = []
    for _, row in df.iterrows():
        feats = build_row(row)
        # Drop rows with no tech signal at all (respondent skipped tech sections).
        if sum(feats.values()) == 0.0:
            continue
        feats["career"] = row["career"]
        records.append(feats)
    out = pd.DataFrame(records)[FEATURE_ORDER + ["career"]]
    print(f"\n  Rows with usable tech answers (all years): {len(out)}")

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
