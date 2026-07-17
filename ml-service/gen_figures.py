"""Generate figures for the FYP documentation from the trained model."""
import json, os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
from career_data import generate_dataset, FEATURE_ORDER, CAREER_LABELS

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, "..", "docs-figures"))
os.makedirs(OUT, exist_ok=True)

NAVY = "#0f2a4a"
GOLD = "#e0a200"

# ---- recompute confusion matrix on the same split used in training ----
df = generate_dataset(n_per_class=600, noise=0.26, seed=42)
X = df[FEATURE_ORDER].values
y = df["career"].values
_, X_test, _, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
model = joblib.load("career_model.pkl")
pred = model.predict(X_test)
cm = confusion_matrix(y_test, pred, labels=CAREER_LABELS)

short = [c.replace(" / ", "/").replace("Machine Learning", "ML")
          .replace("Cybersecurity", "Cyber").replace("Developer", "Dev")
          .replace("Engineer", "Eng").replace("Analyst", "Analyst")
          .replace("Scientist", "Sci") for c in CAREER_LABELS]

cmap = LinearSegmentedColormap.from_list("cg", ["#ffffff", "#f5d488", GOLD, NAVY])
fig, ax = plt.subplots(figsize=(8.4, 7.0))
im = ax.imshow(cm, cmap=cmap)
ax.set_xticks(range(len(short))); ax.set_yticks(range(len(short)))
ax.set_xticklabels(short, rotation=45, ha="right", fontsize=8)
ax.set_yticklabels(short, fontsize=8)
ax.set_xlabel("Predicted career", fontsize=10, fontweight="bold")
ax.set_ylabel("Actual career", fontsize=10, fontweight="bold")
ax.set_title("Confusion Matrix — Random Forest (test set, n=1200)",
             fontsize=11, fontweight="bold", color=NAVY, pad=12)
thresh = cm.max() / 2
for i in range(len(short)):
    for j in range(len(short)):
        v = cm[i, j]
        if v:
            ax.text(j, i, v, ha="center", va="center", fontsize=8,
                    color="white" if v > thresh else NAVY)
fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
plt.tight_layout()
plt.savefig(f"{OUT}/fig_confusion_matrix.png", dpi=150, bbox_inches="tight")
plt.close()

# ---- feature importance ----
meta = json.load(open("model_meta.json"))
fi = meta["feature_importance"]
items = sorted(fi.items(), key=lambda t: t[1])  # ascending for barh
names = [n.replace("_", " ").title() for n, _ in items]
vals = [v for _, v in items]
fig, ax = plt.subplots(figsize=(8.0, 7.2))
colors = [GOLD if v >= np.percentile(vals, 66) else "#5b7aa3" for v in vals]
ax.barh(names, vals, color=colors, edgecolor=NAVY, linewidth=0.4)
ax.set_xlabel("Importance (Gini)", fontsize=10, fontweight="bold")
ax.set_title("Feature Importance — Random Forest",
             fontsize=11, fontweight="bold", color=NAVY, pad=12)
ax.spines[["top", "right"]].set_visible(False)
ax.tick_params(labelsize=8)
plt.tight_layout()
plt.savefig(f"{OUT}/fig_feature_importance.png", dpi=150, bbox_inches="tight")
plt.close()

print("confusion matrix diagonal (correct):", int(np.trace(cm)), "/", int(cm.sum()))
print("saved figures to", OUT)

# ---- algorithm comparison bar chart (from model_meta.json) ----
import json as _json
meta = _json.load(open("model_meta.json"))
comp = meta.get("algorithm_comparison", [])
if comp:
    names = [c["algorithm"] for c in comp][::-1]
    accs = [c["cv_accuracy_mean"] * 100 for c in comp][::-1]
    errs = [c["cv_accuracy_std"] * 100 for c in comp][::-1]
    chosen = meta.get("chosen_algorithm")
    colors = [GOLD if n == chosen else "#5b7aa3" for n in names]
    fig, ax = plt.subplots(figsize=(8.0, 4.2))
    bars = ax.barh(names, accs, xerr=errs, color=colors, edgecolor=NAVY,
                   linewidth=0.5, capsize=4)
    lo = max(0, min(accs) - max(errs) - 3)
    hi = min(100, max(accs) + max(errs) + 3)
    ax.set_xlim(lo, hi)
    ax.set_xlabel("5-fold CV accuracy (%) -- real + disclosed synthetic rows",
                  fontsize=10, fontweight="bold")
    ax.set_title("Algorithm Comparison (chosen model in gold)",
                 fontsize=11, fontweight="bold", color=NAVY, pad=12)
    for b, a in zip(bars, accs):
        ax.text(a + (hi - lo) * 0.01, b.get_y() + b.get_height()/2, f"{a:.1f}%",
                va="center", fontsize=9, color=NAVY)
    ax.spines[["top", "right"]].set_visible(False)
    plt.tight_layout()
    plt.savefig(f"{OUT}/fig_algorithm_comparison.png", dpi=150, bbox_inches="tight")
    plt.close()
    print("saved algorithm comparison chart")

# ---- honest full-vs-real-only comparison (only if augment_profiles.py has run) ----
real_only = meta.get("real_only")
if real_only:
    labels = ["Test accuracy", "Macro F1"]
    full_vals = [meta["test_accuracy"] * 100, meta["macro_f1"] * 100]
    real_vals = [real_only["test_accuracy"] * 100, real_only["macro_f1"] * 100]
    x = np.arange(len(labels))
    width = 0.32
    fig, ax = plt.subplots(figsize=(6.4, 4.2))
    b1 = ax.bar(x - width / 2, full_vals, width, label="Full (incl. synthetic O*NET rows)",
                color=GOLD, edgecolor=NAVY, linewidth=0.5)
    b2 = ax.bar(x + width / 2, real_vals, width, label="Real-only (honest real-world number)",
                color="#5b7aa3", edgecolor=NAVY, linewidth=0.5)
    for bars in (b1, b2):
        for b in bars:
            ax.text(b.get_x() + b.get_width() / 2, b.get_height() + 0.6,
                     f"{b.get_height():.1f}%", ha="center", fontsize=9, color=NAVY)
    ax.set_xticks(x); ax.set_xticklabels(labels, fontsize=10)
    ax.set_ylabel("%", fontsize=10, fontweight="bold")
    ax.set_ylim(0, max(full_vals + real_vals) + 10)
    ax.set_title("Full vs. Real-Only Evaluation\n(Cybersecurity/UI-UX scores in "
                 "\"Full\" measure O*NET-profile recovery, not real-world accuracy)",
                 fontsize=10.5, fontweight="bold", color=NAVY, pad=12)
    ax.legend(fontsize=8, loc="lower right")
    ax.spines[["top", "right"]].set_visible(False)
    plt.tight_layout()
    plt.savefig(f"{OUT}/fig_full_vs_real_only.png", dpi=150, bbox_inches="tight")
    plt.close()
    print("saved full-vs-real-only comparison chart")
