import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";

// careerEngine.ts persists through userStore.ts, which pulls in Firebase —
// stub it so these pure-logic tests never touch the real SDK.
vi.mock("@/lib/firebase", () => ({
    auth: { currentUser: null },
    db: {},
}));
vi.mock("firebase/firestore", () => ({
    doc: vi.fn(),
    setDoc: vi.fn().mockResolvedValue(undefined),
    getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => ({}) }),
}));

// This repo has a real VITE_ML_API_URL configured (career-genie-ml.onrender.com).
// Force every fetch to fail immediately so predictCareers() deterministically and
// quickly exercises the offline fallback scorer instead of hitting a live service
// (or hanging on its 8s timeout) during tests.
const originalFetch = global.fetch;
beforeAll(() => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network disabled in tests"));
});
afterAll(() => {
    global.fetch = originalFetch;
});

import { auth } from "@/lib/firebase";
import {
    traitScore, buildFeatures, analyzeSkillGap, emptySkillRatings,
    predictCareers, strongSkillsText, type Assessment,
    loadAssessmentDraft, saveAssessmentDraft, clearAssessmentDraft,
    warmMlService,
} from "@/lib/careerEngine";
import { PERSONALITY, SKILLS, FEATURE_ORDER } from "@/lib/mlSchema";
import { CAREER_LABELS } from "@/lib/careerCatalog";

describe("traitScore", () => {
    it("averages 1-5 Likert answers and scales to 0..1", () => {
        // Both leadership questions answered 5 (max) -> (5-1)/4 = 1
        const score = traitScore("leadership", { ld1: 5, ld2: 5 });
        expect(score).toBeCloseTo(1);
    });

    it("scales the minimum Likert value (1) to 0", () => {
        const score = traitScore("leadership", { ld1: 1, ld2: 1 });
        expect(score).toBeCloseTo(0);
    });

    it("falls back to 0.5 when no answers exist for the trait", () => {
        expect(traitScore("leadership", {})).toBe(0.5);
    });

    it("ignores non-numeric/undefined answers instead of poisoning the average", () => {
        const score = traitScore("leadership", { ld1: 5, ld2: undefined as unknown as number });
        expect(score).toBeCloseTo(1); // only the valid answer counts
    });
});

describe("buildFeatures", () => {
    const baseAssessment: Assessment = {
        personalityAnswers: Object.fromEntries(
            ["ld1", "ld2", "cr1", "cr2", "cm1", "cm2", "ps1", "ps2", "an1", "an2", "tm1", "tm2"]
                .map((id) => [id, 3])
        ),
        skillRatings: emptySkillRatings(),
        completedAt: Date.now(),
    };

    it("produces exactly one value per feature, in FEATURE_ORDER", () => {
        const features = buildFeatures(baseAssessment);
        expect(Object.keys(features).sort()).toEqual([...FEATURE_ORDER].sort());
    });

    it("scales skill ratings (0-4) to 0..1", () => {
        const features = buildFeatures({
            ...baseAssessment,
            skillRatings: { ...emptySkillRatings(), python: 4, react: 2 },
        });
        expect(features.python).toBeCloseTo(1);
        expect(features.react).toBeCloseTo(0.5);
    });

    it("treats a missing skill rating as 0 instead of NaN", () => {
        const partial = { ...emptySkillRatings() };
        delete (partial as Record<string, number>).python;
        const features = buildFeatures({ ...baseAssessment, skillRatings: partial });
        expect(features.python).toBe(0);
        expect(Number.isNaN(features.python)).toBe(false);
    });

    it("clamps out-of-range skill ratings into 0..1", () => {
        const features = buildFeatures({
            ...baseAssessment,
            skillRatings: { ...emptySkillRatings(), python: 99, sql: -5 },
        });
        expect(features.python).toBeLessThanOrEqual(1);
        expect(features.sql).toBeGreaterThanOrEqual(0);
    });

    it("covers every personality trait", () => {
        const features = buildFeatures(baseAssessment);
        for (const trait of PERSONALITY) expect(typeof features[trait]).toBe("number");
    });
});

describe("emptySkillRatings", () => {
    it("returns 0 for every defined skill", () => {
        const empty = emptySkillRatings();
        expect(Object.keys(empty).length).toBe(SKILLS.length);
        expect(Object.values(empty).every((v) => v === 0)).toBe(true);
    });
});

describe("analyzeSkillGap", () => {
    it("flags a skill the user hasn't developed as 'missing'", () => {
        const items = analyzeSkillGap("Data Scientist", emptySkillRatings());
        const python = items.find((i) => i.skill === "python");
        expect(python?.status).toBe("missing");
    });

    it("flags a skill rated at/above the required level as 'strong'", () => {
        const items = analyzeSkillGap("Data Scientist", { ...emptySkillRatings(), python: 4, statistics: 4, machine_learning: 4, sql: 4 });
        const python = items.find((i) => i.skill === "python");
        expect(python?.status).toBe("strong");
    });

    it("sorts the biggest gaps first", () => {
        const items = analyzeSkillGap("Data Scientist", emptySkillRatings());
        for (let i = 1; i < items.length; i++) {
            const gapPrev = items[i - 1].required - items[i - 1].current;
            const gapCur = items[i].required - items[i].current;
            expect(gapPrev).toBeGreaterThanOrEqual(gapCur - 1e-9);
        }
    });

    it("returns an empty list for an unknown career instead of throwing", () => {
        expect(analyzeSkillGap("Not A Real Career", emptySkillRatings())).toEqual([]);
    });
});

describe("strongSkillsText", () => {
    it("lists only skills rated 3 or higher", () => {
        const text = strongSkillsText({ ...emptySkillRatings(), python: 4, react: 3, sql: 1 });
        expect(text).toContain("Python");
        expect(text).toContain("React");
        expect(text).not.toContain("SQL");
    });
});

describe("predictCareers (offline fallback — no ML API configured in tests)", () => {
    const zeroFeatures = Object.fromEntries(FEATURE_ORDER.map((f) => [f, 0])) as Record<
        (typeof FEATURE_ORDER)[number],
        number
    >;

    it("returns a probability distribution that sums to ~1", async () => {
        const result = await predictCareers(zeroFeatures, CAREER_LABELS.length);
        const sum = result.predictions.reduce((s, p) => s + p.probability, 0);
        expect(sum).toBeCloseTo(1, 2);
    });

    it("only returns careers that exist in the catalog", async () => {
        const result = await predictCareers(zeroFeatures);
        for (const p of result.predictions) expect(CAREER_LABELS).toContain(p.career);
    });

    it("respects topK", async () => {
        const result = await predictCareers(zeroFeatures, 3);
        expect(result.predictions.length).toBeLessThanOrEqual(3);
    });

    it("clamps topK above the number of available careers instead of returning holes", async () => {
        const result = await predictCareers(zeroFeatures, 999);
        expect(result.predictions.length).toBe(CAREER_LABELS.length);
        expect(result.predictions.every((p) => p && typeof p.probability === "number")).toBe(true);
    });

    it("marks the source as local when no ML API is configured", async () => {
        const result = await predictCareers(zeroFeatures);
        expect(result.source).toBe("local");
    });

    it("never produces NaN/Infinity probabilities", async () => {
        const result = await predictCareers(zeroFeatures);
        for (const p of result.predictions) {
            expect(Number.isFinite(p.probability)).toBe(true);
        }
    });
});

describe("predictCareers (authenticated ML API call)", () => {
    const zeroFeatures = Object.fromEntries(FEATURE_ORDER.map((f) => [f, 0])) as Record<
        (typeof FEATURE_ORDER)[number],
        number
    >;
    // The real Auth type declares currentUser readonly; the test double doesn't
    // enforce that at runtime, so route assignment through an untyped view.
    const mutableAuth = auth as unknown as { currentUser: unknown };

    afterEach(() => {
        mutableAuth.currentUser = null;
    });

    it("attaches the caller's Firebase ID token as a Bearer header when calling /predict", async () => {
        const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
        fetchMock.mockClear();
        mutableAuth.currentUser = { getIdToken: vi.fn().mockResolvedValue("fake-id-token") };

        await predictCareers(zeroFeatures);

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining("/predict"),
            expect.objectContaining({
                headers: expect.objectContaining({ Authorization: "Bearer fake-id-token" }),
            })
        );
    });

    it("skips the ML API call and falls back to local scoring when no user is signed in", async () => {
        const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
        fetchMock.mockClear();
        mutableAuth.currentUser = null;

        const result = await predictCareers(zeroFeatures);

        expect(fetchMock).not.toHaveBeenCalled();
        expect(result.source).toBe("local");
    });
});

describe("warmMlService", () => {
    it("pings the ML API's base URL to wake a sleeping instance, without throwing", () => {
        const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
        fetchMock.mockClear();
        expect(() => warmMlService()).not.toThrow();
        expect(fetchMock).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({ method: "GET", mode: "no-cors" })
        );
    });
});

describe("assessment draft persistence", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("returns null when no draft has been saved", () => {
        expect(loadAssessmentDraft()).toBeNull();
    });

    it("round-trips a saved draft", () => {
        saveAssessmentDraft({
            personalityAnswers: { ld1: 4 },
            skillRatings: { ...emptySkillRatings(), python: 2 },
            touchedSkillKeys: ["python"],
        });
        expect(loadAssessmentDraft()).toEqual({
            personalityAnswers: { ld1: 4 },
            skillRatings: { ...emptySkillRatings(), python: 2 },
            touchedSkillKeys: ["python"],
        });
    });

    it("removes the draft on clear", () => {
        saveAssessmentDraft({ personalityAnswers: { ld1: 4 }, skillRatings: emptySkillRatings(), touchedSkillKeys: [] });
        clearAssessmentDraft();
        expect(loadAssessmentDraft()).toBeNull();
    });
});
