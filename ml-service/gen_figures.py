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

OUT = "/home/claude/Merajfyp/docs-figures"
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
    ax.set_xlim(90, 100)
    ax.set_xlabel("5-fold CV accuracy (%)", fontsize=10, fontweight="bold")
    ax.set_title("Algorithm Comparison (chosen model in gold)",
                 fontsize=11, fontweight="bold", color=NAVY, pad=12)
    for b, a in zip(bars, accs):
        ax.text(a + 0.15, b.get_y() + b.get_height()/2, f"{a:.1f}%",
                va="center", fontsize=9, color=NAVY)
    ax.spines[["top", "right"]].set_visible(False)
    plt.tight_layout()
    plt.savefig(f"{OUT}/fig_algorithm_comparison.png", dpi=150, bbox_inches="tight")
    plt.close()
    print("saved algorithm comparison chart")
