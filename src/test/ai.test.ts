import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";

vi.mock("@/lib/firebase", () => ({
    auth: { currentUser: { getIdToken: vi.fn().mockResolvedValue("fake-id-token") } },
    db: {},
}));

const originalFetch = global.fetch;
beforeAll(() => {
    global.fetch = vi.fn();
});
afterAll(() => {
    global.fetch = originalFetch;
});

import { aiText } from "@/lib/ai";

describe("aiText", () => {
    beforeEach(() => {
        (global.fetch as ReturnType<typeof vi.fn>).mockReset();
    });

    it("returns the completion content on success", async () => {
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ content: "Rewritten bullet points." }),
        });
        await expect(aiText("system", "user")).resolves.toBe("Rewritten bullet points.");
    });

    it("retries once on failure and succeeds if the retry works", async () => {
        (global.fetch as ReturnType<typeof vi.fn>)
            .mockRejectedValueOnce(new Error("network blip"))
            .mockResolvedValueOnce({ ok: true, json: async () => ({ content: "Recovered." }) });
        await expect(aiText("system", "user")).resolves.toBe("Recovered.");
    });

    it("throws (does not silently resolve to an empty string) when both attempts fail", async () => {
        // Regression test: aiText used to swallow a failure on both attempts and
        // resolve to "" instead of rejecting. Every real caller (resume bullet
        // rewriting, the career-fit explanation, the instructor chat) wraps its
        // call in a try/catch with a real fallback that depends on this actually
        // throwing — silently resolving made all of those catch blocks
        // unreachable, so a failed AI call looked identical to a successful one
        // that happened to say nothing, and got displayed/persisted as such.
        (global.fetch as ReturnType<typeof vi.fn>)
            .mockRejectedValueOnce(new Error("network down"))
            .mockRejectedValueOnce(new Error("network still down"));
        await expect(aiText("system", "user")).rejects.toThrow();
    });
});
