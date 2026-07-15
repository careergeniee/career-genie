import { describe, it, expect } from "vitest";
import { safeUrl } from "@/lib/roadmap";

describe("safeUrl", () => {
    it("allows https URLs", () => {
        expect(safeUrl("https://developer.mozilla.org/")).toBe("https://developer.mozilla.org/");
    });
    it("allows http URLs", () => {
        expect(safeUrl("http://example.com")).toBe("http://example.com");
    });
    it("rejects javascript: URLs", () => {
        expect(safeUrl("javascript:alert(1)")).toBeUndefined();
    });
    it("rejects data: URLs", () => {
        expect(safeUrl("data:text/html,<script>alert(1)</script>")).toBeUndefined();
    });
    it("rejects malformed input", () => {
        expect(safeUrl("not a url")).toBeUndefined();
    });
    it("passes through undefined", () => {
        expect(safeUrl(undefined)).toBeUndefined();
    });
});
