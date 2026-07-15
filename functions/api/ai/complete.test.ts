import { describe, it, expect, vi, beforeEach } from "vitest";

const { requireUser } = vi.hoisted(() => ({ requireUser: vi.fn() }));
vi.mock("../_lib/auth.js", () => ({ requireUser, AuthError: class AuthError extends Error {} }));

import { onRequestPost } from "./complete";

const ENV = { GROQ_API_KEY: "test-key", FIREBASE_PROJECT_ID: "test-project" };

function makeRequest(body: unknown) {
    return new Request("https://example.com/api/ai/complete", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

describe("onRequestPost /api/ai/complete", () => {
    beforeEach(() => {
        requireUser.mockReset();
        vi.unstubAllGlobals();
    });

    it("returns 401 when requireUser rejects", async () => {
        requireUser.mockRejectedValue(new Error("no auth"));
        const res = await onRequestPost({
            request: makeRequest({ messages: [{ role: "user", content: "hi" }] }),
            env: ENV,
        });
        expect(res.status).toBe(401);
    });

    it("returns 400 when messages is missing", async () => {
        requireUser.mockResolvedValue("uid-1");
        const res = await onRequestPost({ request: makeRequest({}), env: ENV });
        expect(res.status).toBe(400);
    });

    it("forwards to Groq and returns the completion content", async () => {
        requireUser.mockResolvedValue("uid-1");
        const fetchMock = vi.fn().mockResolvedValue(
            new Response(JSON.stringify({ choices: [{ message: { content: "Hello there" } }] }), { status: 200 })
        );
        vi.stubGlobal("fetch", fetchMock);

        const res = await onRequestPost({
            request: makeRequest({ messages: [{ role: "user", content: "hi" }] }),
            env: ENV,
        });

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ content: "Hello there" });
        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.groq.com/openai/v1/chat/completions",
            expect.objectContaining({ method: "POST" })
        );
    });

    it("returns the upstream status when Groq responds with an error", async () => {
        requireUser.mockResolvedValue("uid-1");
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 429 })));

        const res = await onRequestPost({
            request: makeRequest({ messages: [{ role: "user", content: "hi" }] }),
            env: ENV,
        });

        expect(res.status).toBe(429);
    });
});
