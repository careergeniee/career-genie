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
});
