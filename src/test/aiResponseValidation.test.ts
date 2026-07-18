import { describe, it, expect, vi } from "vitest";

const aiJsonMock = vi.fn();
vi.mock("@/lib/ai", () => ({
    aiJson: (...args: unknown[]) => aiJsonMock(...args),
}));
vi.mock("@/lib/userStore", () => ({
    uid8: () => "test-id",
}));

import { evaluateAnswer, generateQuestions } from "@/lib/interview";
import { scoreResume, emptyResume } from "@/lib/resume";

describe("evaluateAnswer (regression: malformed AI response shape)", () => {
    it("falls back to a neutral score instead of the worst possible one when the AI's score isn't numeric", async () => {
        // Regression test: `Number("8/10") || 0` used to silently misgrade a
        // real, possibly-strong answer to 0/10 with no error surfaced --
        // a malformed response is not evidence of a bad answer.
        aiJsonMock.mockResolvedValue({ score: "8/10", feedback: "Good answer.", idealPoints: ["a"] });
        const result = await evaluateAnswer("Software Engineer", "mid", "Q?", "a real answer");
        expect(result.score).toBe(5);
    });

    it("still clamps and rounds a genuinely numeric score correctly", async () => {
        aiJsonMock.mockResolvedValue({ score: 7.6, feedback: "ok", idealPoints: [] });
        const result = await evaluateAnswer("Software Engineer", "mid", "Q?", "a real answer");
        expect(result.score).toBe(8);
    });

    it("does not misgrade a genuine 0 score as malformed", async () => {
        aiJsonMock.mockResolvedValue({ score: 0, feedback: "Off-topic.", idealPoints: [] });
        const result = await evaluateAnswer("Software Engineer", "mid", "Q?", "a real answer");
        expect(result.score).toBe(0);
    });

    it("drops a non-string feedback/idealPoints entry instead of persisting an object that crashes on render", async () => {
        aiJsonMock.mockResolvedValue({
            score: 6,
            feedback: { good: "x", bad: "y" }, // model deviated from the requested string shape
            idealPoints: ["valid point", { point: "invalid nested shape" }, 42],
        });
        const result = await evaluateAnswer("Software Engineer", "mid", "Q?", "a real answer");
        expect(result.feedback).toBe("");
        expect(result.idealPoints).toEqual(["valid point"]);
    });
});

describe("generateQuestions (regression: non-string question entries)", () => {
    it("filters out non-string question entries instead of letting them crash the review screen", async () => {
        aiJsonMock.mockResolvedValue({
            questions: ["Real question?", { text: "nested object, not a string" }, "", "Another real one?"],
        });
        const qs = await generateQuestions("Software Engineer", "mid");
        expect(qs).toEqual(["Real question?", "Another real one?"]);
    });
});

describe("scoreResume (regression: malformed AI response shape)", () => {
    it("falls back to a neutral score instead of the worst possible one when the AI's score isn't numeric", async () => {
        aiJsonMock.mockResolvedValue({
            score: "not a number",
            summary: "Decent resume.",
            strengths: [],
            improvements: [],
            missingKeywords: [],
        });
        const result = await scoreResume(emptyResume(), "Software Engineer");
        expect(result.score).toBe(50);
    });

    it("drops non-string entries from strengths/improvements/missingKeywords instead of crashing on render", async () => {
        aiJsonMock.mockResolvedValue({
            score: 80,
            summary: { not: "a string" },
            strengths: ["Clear structure", { nested: "object" }],
            improvements: [null, "Add metrics"],
            missingKeywords: ["Kubernetes", 42],
        });
        const result = await scoreResume(emptyResume(), "Software Engineer");
        expect(result.summary).toBe("");
        expect(result.strengths).toEqual(["Clear structure"]);
        expect(result.improvements).toEqual(["Add metrics"]);
        expect(result.missingKeywords).toEqual(["Kubernetes"]);
    });
});
