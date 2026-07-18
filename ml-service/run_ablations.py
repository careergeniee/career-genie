import os
import subprocess
import json

def run_ablation(name, env_vars):
    env = os.environ.copy()
    env.update(env_vars)
    print(f"--- Running {name} ---")
    subprocess.run([r".venv\Scripts\python.exe", "train.py"], env=env, stdout=subprocess.DEVNULL)
    with open("model_meta.json", "r") as f:
        meta = json.load(f)
    print(f"  Top-level test_accuracy : {meta.get('test_accuracy', 'N/A')}")
    if "real_only" in meta:
        print(f"  Real-only test_accuracy : {meta['real_only']['test_accuracy']}")
        print(f"  Real-only macro_f1      : {meta['real_only']['macro_f1']}")
    else:
        print("  No real_only metrics found.")
    print()

def main():
    run_ablation("Ablation A: Oversample 1000", {"OVERSAMPLE_TARGET": "1000"})
    run_ablation("Ablation A: Oversample 1200", {"OVERSAMPLE_TARGET": "1200"})
    run_ablation("Ablation A: Oversample 2000", {"OVERSAMPLE_TARGET": "2000"})

if __name__ == "__main__":
    main()
