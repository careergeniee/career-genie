import { describe, it, expect } from "vitest";
import { isKnown } from "@/lib/careerStacks";

describe("isKnown", () => {
    it("matches a simple single-word technology", () => {
        expect(isKnown("Python", "I know Python and SQL")).toBe(true);
    });
    it("matches when the user knows one half of a '+'-joined pair", () => {
        expect(isKnown("Node.js + Express", "I've used Node.js for backend work")).toBe(true);
    });
    it("matches the other half of a '+'-joined pair", () => {
        expect(isKnown("Node.js + Express", "I know Express and MongoDB")).toBe(true);
    });
    it("does not match when neither half is present", () => {
        expect(isKnown("Node.js + Express", "I know Python and Django")).toBe(false);
    });
    it("does not match 'java' inside 'javascript'", () => {
        expect(isKnown("Java", "I write JavaScript")).toBe(false);
    });
    it("returns false for empty skills text", () => {
        expect(isKnown("Python", "")).toBe(false);
    });

    // Regression: a length>=2 filter on split tokens made single-letter
    // language names permanently unmatchable, since "R (alternative)" split
    // to just "r" (length 1) and got filtered out, leaving no cores to check.
    it("matches a single-letter technology name like R", () => {
        expect(isKnown("R (alternative)", "I know R and Python")).toBe(true);
    });

    // Regression: parenthetical alternatives ("(Redux/Zustand)") were
    // stripped and discarded entirely instead of being checked individually.
    it("matches an alternative technology listed inside parentheses", () => {
        expect(isKnown("State management (Redux/Zustand)", "I use Redux for state")).toBe(true);
        expect(isKnown("Authentication (JWT/OAuth)", "I've implemented OAuth login")).toBe(true);
    });

    it("still matches the outer phrase when no parenthetical alternative is present", () => {
        expect(isKnown("State management (Redux/Zustand)", "I understand state management concepts")).toBe(true);
    });

    it("does not treat a single-word qualifier in parentheses as a matchable technology", () => {
        // "(advanced)" is a qualifier on "Excel", not an alternative tech name --
        // the word "advanced" appearing elsewhere in someone's skills text must
        // not falsely mark "Excel (advanced)" as known.
        expect(isKnown("Excel (advanced)", "I have advanced knowledge of statistics")).toBe(false);
    });
});
