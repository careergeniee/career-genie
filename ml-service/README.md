# Career Genie — ML Service

A small Python service that powers the **Career Prediction** module.
It trains a calibrated scikit-learn classifier (currently **Gradient
Boosting**, selected by cross-validated comparison) on **real survey data**
(Stack Overflow Developer Surveys 2022–2024 + Kaggle's ML & Data Science
Survey 2020) — actual professionals' tech stacks vs. their actual jobs — and serves
ranked career predictions over a REST API (FastAPI). The React frontend
calls it; if it's offline, the frontend falls back to an in-browser scorer
so the app never breaks.

```
career_data.py     schema + synthetic dataset generator (legacy/demo)
preprocess_so.py   builds real_dataset_so.csv from the SO 2022-2024 surveys
                    (3 years merged, tech names normalized across years)
preprocess_kaggle_da.py   merges real Data Analyst rows from Kaggle's 2020
                    ML & Data Science Survey into real_dataset_so.csv
preprocess_kaggle_mle.py  merges real Machine Learning Engineer rows from
                    the same Kaggle survey (run after preprocess_kaggle_da.py)
augment_profiles.py adds disclosed synthetic O*NET-profile rows for the two
                    classes no real survey covers (Cybersecurity, UI/UX)
real_dataset_so.csv processed training data (real professionals, two
                    merged real surveys — see below)
train.py           compares 4 algorithms, calibrates winner, saves model
app.py             FastAPI service (/health, /predict, /meta)
auth.py            verifies the Firebase ID token required by /predict
career_model.pkl   trained model (regenerate with the steps below)
model_meta.json    feature order, labels, metrics, feature importance
```

## Dataset (v3.1): Stack Overflow surveys 2022–2024 + Kaggle ML & DS Survey 2020

The model is trained on **four merged real surveys**, all label = respondent's
own stated job, features = tools the respondent actually reported using:

1. **Official Stack Overflow Annual Developer Surveys 2024, 2023, and 2022**
   (~184k raw respondents; data: `github.com/StackExchange/Survey`,
   `packages/archive/<year>/results.csv`) — `DevType` filtered to "I am a
   developer by profession", mapped onto our 10 career labels. Different
   years are different respondents, so merging multiplies the rare classes
   with real people. 2022's multi-select DevType rows are kept only when
   every selected role maps to the same single label; tech names are
   normalized across years (2022 "AWS" ≡ 2024 "Amazon Web Services (AWS)").
2. **Kaggle's own 2020 Machine Learning & Data Science Survey** (20,036
   respondents; official competition data: `kaggle.com/c/kaggle-survey-2020`)
   — `Q5` filtered to respondents who self-selected **"Data Analyst"**
   (1,475) or **"Machine Learning Engineer"** (1,082), features derived from
   the tools/languages they reported using in Q7/Q14/Q16/Q26/Q29. This survey
   is data-science-only (no web/mobile/security questions), so it is used
   **only** to grow these two classes — see `preprocess_kaggle_da.py` /
   `preprocess_kaggle_mle.py`.

Combined: **26,306 rows** after filtering, mapping, merging, and capping the
big classes at 4,000 rows each. Versus the original single-year dataset:
Data Analyst 178 → 1,899 rows, Machine Learning Engineer 442 → 1,482,
Data Scientist 749 → 2,413, Cybersecurity Analyst 133 → 360, UI/UX Designer
46 → 152, Cloud/DevOps 1,423 → 4,000 (capped).

**Cybersecurity Analyst and UI/UX Designer: disclosed synthetic rows
(v3.2).** Both roles were searched for extensively — no real, per-respondent,
tool-usage dataset exists for either (the closest Kaggle candidates are
job-posting scrapes or generated practice datasets: fake signal). But the
app *does* collect `networking_security` and `ui_ux_design` self-ratings and
needs the model to act on them, so `augment_profiles.py` adds **1,500
synthetic rows per class**, sampled (Gaussian noise) around the **O*NET
occupational profiles** in `career_data.py` (US Dept. of Labor data: SOC
15-1212.00 Information Security Analysts, SOC 15-1255.00 Web & Digital
Interface Designers). Three honesty guarantees:

- every row is tagged `source="synthetic-onet"` in the CSV (real rows:
  `source="real"`), so the provenance is auditable;
- `train.py` additionally reports a **real-only** test evaluation, so the
  real-world numbers are never conflated with synthetic ones — the
  per-class scores for these two classes measure *recovery of the
  documented O*NET profile*, not validated real-world accuracy;
- personality traits are zeroed in synthetic rows (real surveys don't
  measure them either), so the model cannot learn a spurious
  "any personality signal ⇒ Designer/Security" shortcut.

**Why v3 exists — the leakage audit.** Earlier versions trained on a Kaggle
"CS students" dataset whose preprocessing copied each row's career label into
its features (O*NET profile imputation + per-career minimum floors). An
ablation audit showed: full pipeline 96% accuracy → leakage removed 22% —
exactly the majority-class baseline. The 96% was an artifact; the Kaggle data
contains no real skill→career signal. The v3 dataset is built so that **no
feature is ever derived from, floored by, or imputed from the label.**

**Honest limitations** (state these in the report — they are features of
honesty, not bugs):
- The 6 personality traits have no counterpart in any survey; they are
  constant 0 in training (including synthetic rows, deliberately), so the ML
  model ignores them — only the in-app offline scorer uses them.
  `networking_security` and `ui_ux_design` are populated **only** in the
  synthetic O*NET rows, which is exactly the disclosed mechanism that lets
  the model identify Cybersecurity Analysts and UI/UX Designers from those
  self-ratings.
- Survey features are binary "have used" flags; the app sends 0–1
  self-ratings. Tree splits tolerate this shift, but it is a real
  train/serve distribution difference.
- **Machine Learning Engineer vs. Data Analyst vs. Data Scientist** overlap
  partially: all three draw partly from the same Kaggle survey population,
  and real ML engineers, data analysts, and data scientists genuinely share
  a lot of tooling (Python, SQL, stats, viz). The merges lifted both classes
  from statistical noise to real predictions (ML Engineer F1 0.00 → 0.53,
  Data Analyst 0.00 → 0.60) with the residual confusion flowing between
  these three data roles — an honest trade-off visible in the confusion
  matrix, not a bug. See `model_meta.json` for the full per-class numbers.

## Model at a glance (for your report)

- **Selection:** four algorithms compared with 5-fold cross-validation.
  Gradient Boosting is selected by highest CV accuracy (the
  interpretability-preference policy only overrides within 2 pp of Random
  Forest; RF stays too far behind).
- **Baseline context:** majority-class baseline is ~13.6%, random guess 10%.
  **Two numbers, always reported together:** 61.2% accuracy / macro-F1 0.64
  on the full test set (includes synthetic-class rows), and **56.8%
  accuracy on the real-only test subset** — the honest real-world figure.
  Per-class F1 (full test): Mobile 0.79, Data Scientist 0.68, Frontend
  0.63, ML Engineer 0.59 (was 0.00 pre-merge), Data Analyst 0.56 (was
  0.00), Cloud/DevOps 0.55 (was 0.18 single-year), Full Stack 0.41,
  Backend 0.39, plus Cybersecurity 0.89 and UI/UX 0.95 — those last two
  measure O*NET-profile recovery (see Dataset section), not validated
  real-world accuracy.
- **Calibration:** the winner is wrapped in `CalibratedClassifierCV`
  (isotonic, 5-fold) so the probabilities shown as "match %" are calibrated
  (test log-loss 1.13 across 10 classes).
- **Explainability:** a batched single-feature **ablation** fallback
  (~16 ms) — zero out one feature at a time and measure how much it moves
  P(top_career) — so `/predict.explanation` works for any model regardless
  of type. (Previously tried SHAP's `TreeExplainer` first, but the deployed
  Gradient Boosting model is multiclass, which SHAP's TreeExplainer rejects
  outright, so that path never once succeeded and only added an unused
  dependency; removed.)
- **Features (21):** 6 personality traits + 15 skills, all 0–1 (traits are
  currently inert in the ML model — see limitations above).
- **Classes (10):** Data Scientist, ML Engineer, Data Analyst, Frontend,
  Backend, Full Stack, Cybersecurity, Cloud/DevOps, Mobile, UI/UX.
- **Performance:** 0.612 test accuracy (0.568 real-only), 0.617 mean 5-fold
  CV, macro-F1 0.64. The currently selected algorithm is **Random Forest**
  (CV 0.617, within the 2 pp interpretability-preference window of Gradient
  Boosting's 0.633).

`python train.py --data real_dataset_so.csv` prints the algorithm comparison,
classification report, confusion matrix, and feature importances.
`model_meta.json` stores all of it (including `dataset`,
`algorithm_comparison`, and `selected_for`) -- **including a `real_only`
object** (test accuracy, macro F1, log loss, sample count computed on real
rows alone) so the honest number is never just terminal output someone
forgot to copy. The figures used in the report are regenerated by
`python gen_figures.py`, which now also renders `fig_full_vs_real_only.png`
straight from that field.

## Retrain from scratch (full steps)

```bash
cd ml-service
pip install -r requirements.txt

# 1. Download the official SO survey data for 2024, 2023, 2022
#    (~152 + 151 + 104 MB, Git LFS):
mkdir -p data
for Y in 2024 2023 2022; do
  curl -L -o data/so_${Y}_results.csv \
    https://media.githubusercontent.com/media/StackExchange/Survey/main/packages/archive/${Y}/results.csv
done

# 2. Build the training dataset (label-leakage-free by construction):
python preprocess_so.py          # -> real_dataset_so.csv (23,923 rows, 3 years)

# 3. Download Kaggle's 2020 ML & DS Survey and merge in real Data Analyst +
#    Machine Learning Engineer rows:
#    kaggle.com/c/kaggle-survey-2020/data (requires a free Kaggle account to
#    download from the site directly; a public GitHub mirror of the same
#    official CSV also works, e.g. raw.githubusercontent.com/chawla201/
#    Kaggle-ML-DS-Survey-2020-Analysis/master/data/kaggle_survey_2020_responses.csv)
curl -L -o data/kaggle_survey_2020_responses.csv \
  https://raw.githubusercontent.com/chawla201/Kaggle-ML-DS-Survey-2020-Analysis/master/data/kaggle_survey_2020_responses.csv
python preprocess_kaggle_da.py    # -> real_dataset_so.csv grows to 25,266 rows
python preprocess_kaggle_mle.py   # -> real_dataset_so.csv grows to 26,306 rows

# 3b. Add the disclosed synthetic O*NET-profile rows for the two classes no
#     real survey covers (tagged source="synthetic-onet" in the CSV):
python augment_profiles.py        # -> real_dataset_so.csv grows to 29,306 rows

# 4. Train, compare, calibrate, save:
python train.py --data real_dataset_so.csv   # -> career_model.pkl + model_meta.json

# 5. Verify the service against the new model:
python -m pytest -q
```

## Reliability

- **Validation:** request bodies are validated; out-of-range feature values are
  clamped to [0,1] and non-finite values are coerced to 0 — the service never
  crashes on bad input.
- **Confidence:** every prediction returns a `confidence` (margin between the
  top two careers) and an `uncertain` flag, so the UI can flag close calls.
- **Tests:** `pytest -q` runs the suite covering health, prediction
  correctness, validation, clamping, determinism, metadata, and auth.

## Security

`POST /predict` requires a valid Firebase ID token: `Authorization: Bearer <token>`.
It's verified in `auth.py` against Google's public JWKS (no service-account
credential needed) — the same guarantee the Vercel Groq proxy (`api/_lib/auth.ts`)
already enforces, so this is no longer the one fully-open endpoint in the stack.
`GET /health` and `GET /meta` stay unauthenticated (no user data; needed for
uptime checks and the frontend's cold-start warm-up ping).

Set `FIREBASE_PROJECT_ID` in the service's environment (same project ID used
by the frontend's `src/lib/firebase.ts`) — without it, `/predict` always
returns 401.

## Explainability

Every `/predict` response includes an `explanation`: the top 5 features (of
the 21) that most pushed the model toward the predicted career, via batched
single-feature ablation (zero out one feature at a time, measure how much
P(top_career) drops). `contribution` is signed — positive pushes toward the
predicted career, negative pushes away. This is `null` only if the ablation
call itself raises; it never blocks the prediction itself.

## Endpoints

- `GET /health` → status, model version, algorithm, CV accuracy (no auth)
- `GET /meta` → feature order, labels, full algorithm comparison, metrics (no auth)
- `POST /predict` → ranked careers, calibrated probabilities, confidence, `uncertain`,
  feature `explanation` (**requires** `Authorization: Bearer <Firebase ID token>`)

## Run locally

```bash
cd ml-service
python -m venv .venv && source .venv/bin/activate   # optional
pip install -r requirements.txt
export FIREBASE_PROJECT_ID=your-firebase-project-id   # required for /predict
python train.py            # creates career_model.pkl (run once)
uvicorn app:app --reload --port 8000
```

Test the unauthenticated endpoints:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/meta
```

`/predict` needs a real Firebase ID token, so it's easiest to test it through
the actual frontend (`npm run dev` with `VITE_ML_API_URL` pointed here — see
below — attaches the token automatically). To test with `curl` instead, grab
a token from the browser console while signed in
(`await auth.currentUser.getIdToken()`) and pass it as a Bearer token:

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <paste-token-here>" \
  -d '{"features":{"analytical":0.9,"python":0.9,"machine_learning":0.85,"statistics":0.9},"top_k":5}'
```

Then point the frontend at it — in the project root `.env`:

```
VITE_ML_API_URL=http://localhost:8000
```

Restart `npm run dev`. The Career Match page will show the model badge
(the algorithm name from `/health`, e.g. **"Gradient Boosting"**) instead
of "Offline scorer".

## Deploy (free options)

**Render** (easiest):
1. Push this repo to GitHub.
2. New → Web Service → pick the repo, root directory `ml-service`.
3. Build: `pip install -r requirements.txt`
   Start: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Environment → add `FIREBASE_PROJECT_ID` (same project ID the frontend
   uses) — `/predict` returns 401 for every request without it.
5. Deploy, copy the URL (e.g. `https://career-genie-ml.onrender.com`).
6. In Vercel (frontend) → Environment Variables, set
   `VITE_ML_API_URL` to that URL and redeploy.

**Railway / Fly.io** work the same way — they just need the start command
above. The committed `career_model.pkl` means you don't have to retrain on
the server, but the build will also work if you add `python train.py` as a
pre-start step.

> Note: on Render's free tier the service sleeps when idle, so the first
> request after a while is slow. The frontend fallback covers that case.
