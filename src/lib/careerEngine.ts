/**
 * careerEngine.ts
 * ===============
 * The brain of the Career Prediction pipeline.
 *
 *   assessment answers  ->  feature vector  ->  predictCareers()
 *                                                  |
 *                              FastAPI Random Forest (real ML)
 *                                                  |  (offline?)
 *                                          in-browser fallback scorer
 *
 * Plus: skill-gap analysis against the chosen career, and persistence
 * of the latest assessment + prediction (per user, via userStore).
 */

import {
    FEATURE_ORDER,
    PERSONALITY,
    PERSONALITY_QUESTIONS,
    SKILLS,
    CAREER_LABELS,
    SKILL_META,
    idealVector,
    CAREERS,
    type FeatureKey,
    type PersonalityKey,
    type SkillKey,
} from "@/lib/mlSchema";
import { loadData, saveData } from "@/lib/userStore";

const ML_API_URL = import.meta.env.VITE_ML_API_URL as string | undefined;

// -------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------

export interface Assessment {
    /** Likert answers (1-5) keyed by question id. */
    personalityAnswers: Record<string, number>;
    /** Self-rated skills (0-4) keyed by skill. */
    skillRatings: Record<SkillKey, number>;
    completedAt: number;
}

export interface CareerPrediction {
    career: string;
    probability: number; // 0..1
}

export interface PredictionResult {
    predictions: CareerPrediction[];
    topCareer: string;
    source: "ml-api" | "local";
    /** Margin between the top-1 and top-2 probabilities (0..1). */
    confidence: number;
    /** True when the top two careers are a close call. */
    uncertain: boolean;
    /** Which engine produced this (e.g. "Random Forest" or "Offline scorer"). */
    algorithm: string;
    createdAt: number;
}

export interface SkillGapItem {
    skill: SkillKey;
    label: string;
    required: number; // 0..1 target
    current: number; // 0..1 user level
    status: "strong" | "developing" | "missing";
}

// -------------------------------------------------------------------------
// Feature engineering
// -------------------------------------------------------------------------

/** Average the 1-5 Likert answers for one trait and scale to 0..1. */
export function traitScore(
    trait: PersonalityKey,
    answers: Record<string, number>
): number {
    const qs = PERSONALITY_QUESTIONS.filter((q) => q.trait === trait);
    const vals = qs.map((q) => answers[q.id]).filter((v) => typeof v === "number");
    if (vals.length === 0) return 0.5;
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length; // 1..5
    return (avg - 1) / 4; // -> 0..1
}

/** Build the full feature map the model expects from a completed assessment. */
export function buildFeatures(a: Assessment): Record<FeatureKey, number> {
    const out = {} as Record<FeatureKey, number>;
    for (const trait of PERSONALITY) out[trait] = traitScore(trait, a.personalityAnswers);
    for (const skill of SKILLS) {
        const raw = a.skillRatings[skill]; // 0..4
        out[skill] = typeof raw === "number" ? Math.max(0, Math.min(1, raw / 4)) : 0;
    }
    return out;
}

// -------------------------------------------------------------------------
// Prediction
// -------------------------------------------------------------------------

const ML_TIMEOUT_MS = 8000;
const ML_RETRIES = 1;

/** fetch with an abort timeout. */
async function fetchWithTimeout(url: string, init: RequestInit, ms: number) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
        return await fetch(url, { ...init, signal: ctrl.signal });
    } finally {
        clearTimeout(timer);
    }
}

const UNCERTAIN_MARGIN = 0.15;

/** Predict careers — tries the real ML service (with retry), else falls back. */
export async function predictCareers(
    features: Record<FeatureKey, number>,
    topK = 5
): Promise<PredictionResult> {
    if (ML_API_URL) {
        const url = `${ML_API_URL.replace(/\/$/, "")}/predict`;
        for (let attempt = 0; attempt <= ML_RETRIES; attempt++) {
            try {
                const res = await fetchWithTimeout(
                    url,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ features, top_k: topK }),
                    },
                    ML_TIMEOUT_MS
                );
                if (res.ok) {
                    const data = await res.json();
                    const predictions: CareerPrediction[] = (data.predictions || []).map(
                        (p: { career: string; probability: number }) => ({
                            career: p.career,
                            probability: p.probability,
                        })
                    );
                    if (predictions.length) {
                        const confidence =
                            typeof data.confidence === "number"
                                ? data.confidence
                                : predictions[0].probability - (predictions[1]?.probability ?? 0);
                        return {
                            predictions,
                            topCareer: data.top_career || predictions[0].career,
                            source: "ml-api",
                            confidence: Math.max(0, Math.round(confidence * 1000) / 1000),
                            uncertain:
                                typeof data.uncertain === "boolean"
                                    ? data.uncertain
                                    : confidence < UNCERTAIN_MARGIN,
                            algorithm: data.algorithm || "ML model",
                            createdAt: Date.now(),
                        };
                    }
                }
                // Non-OK response: retry once, then fall back.
            } catch {
                // Timeout/network error: retry once, then fall back.
            }
        }
    }
    return localPredict(features, topK);
}

/**
 * Offline fallback: score the user vector against each career's ideal
 * profile and convert distances into probabilities with a softmax.
 * Not the trained Random Forest, but a sensible, deterministic stand-in
 * so the app works before the ML service is deployed.
 */
function localPredict(
    features: Record<FeatureKey, number>,
    topK: number
): PredictionResult {
    const userVec = FEATURE_ORDER.map((f) => features[f] ?? 0);

    const scored = CAREER_LABELS.map((career) => {
        const ideal = idealVector(career);
        // Weighted similarity: features the role cares about (above baseline)
        // matter more, so an aspiring data scientist isn't penalised for not
        // knowing mobile dev.
        let num = 0;
        let den = 0;
        for (let i = 0; i < ideal.length; i++) {
            const w = Math.max(0.15, ideal[i]); // weight by importance
            const diff = ideal[i] - userVec[i];
            num += w * diff * diff;
            den += w;
        }
        const dist = Math.sqrt(num / den); // 0..1-ish
        return { career, similarity: 1 - dist };
    });

    // Softmax over similarity for a clean probability spread.
    const T = 0.12;
    const exps = scored.map((s) => Math.exp(s.similarity / T));
    const sum = exps.reduce((a, b) => a + b, 0);
    const predictions = scored
        .map((s, i) => ({ career: s.career, probability: exps[i] / sum }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, topK);

    const confidence = predictions[0].probability - (predictions[1]?.probability ?? 0);
    return {
        predictions,
        topCareer: predictions[0].career,
        source: "local",
        confidence: Math.max(0, Math.round(confidence * 1000) / 1000),
        uncertain: confidence < UNCERTAIN_MARGIN,
        algorithm: "Offline scorer",
        createdAt: Date.now(),
    };
}

// -------------------------------------------------------------------------
// Skill-gap analysis
// -------------------------------------------------------------------------

const REQUIRED_THRESHOLD = 0.5; // skills the role needs above this level
const STRONG_MARGIN = 0.1; // within this of the target counts as "strong"

/** Compare the user's skills to a target career's required skills. */
export function analyzeSkillGap(
    career: string,
    skillRatings: Record<SkillKey, number>
): SkillGapItem[] {
    const profile = CAREERS[career] || {};
    const items: SkillGapItem[] = [];

    for (const skill of SKILLS) {
        const required = profile[skill];
        if (required === undefined || required < REQUIRED_THRESHOLD) continue;

        const current = Math.max(0, Math.min(1, (skillRatings[skill] ?? 0) / 4));
        let status: SkillGapItem["status"];
        if (current >= required - STRONG_MARGIN) status = "strong";
        else if (current >= required * 0.5) status = "developing";
        else status = "missing";

        items.push({ skill, label: SKILL_META[skill].label, required, current, status });
    }

    // Biggest gaps first.
    return items.sort(
        (a, b) => b.required - b.current - (a.required - a.current)
    );
}

/** A comma-separated list of the user's strongest skills, for the roadmap seed. */
export function strongSkillsText(skillRatings: Record<SkillKey, number>): string {
    return SKILLS.filter((s) => (skillRatings[s] ?? 0) >= 3)
        .map((s) => SKILL_META[s].label)
        .join(", ");
}

// -------------------------------------------------------------------------
// Persistence
// -------------------------------------------------------------------------

const ASSESSMENT_KEY = "assessment";
const PREDICTION_KEY = "prediction";

export const loadAssessment = () => loadData<Assessment | null>(ASSESSMENT_KEY, null);
export const saveAssessment = (a: Assessment) => saveData(ASSESSMENT_KEY, a);
export const loadPrediction = () => loadData<PredictionResult | null>(PREDICTION_KEY, null);
export const savePrediction = (p: PredictionResult) => saveData(PREDICTION_KEY, p);

/** Empty skill ratings (all 0). */
export const emptySkillRatings = (): Record<SkillKey, number> =>
    Object.fromEntries(SKILLS.map((s) => [s, 0])) as Record<SkillKey, number>;
