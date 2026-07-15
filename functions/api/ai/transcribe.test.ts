import { describe, it, expect, vi, beforeEach } from "vitest";

const { requireUser } = vi.hoisted(() => ({ requireUser: vi.fn() }));
vi.mock("../_lib/auth.js", () => ({ requireUser, AuthError: class AuthError extends Error {} }));

import { onRequestPost } from "./transcribe";

const ENV = { GROQ_API_KEY: "test-key", FIREBASE_PROJECT_ID: "test-project" };

function makeRequest(body: BodyInit | null, contentType = "audio/webm") {
    return new Request("https://example.com/api/ai/transcribe", {
        method: "POST",
        headers: { "content-type": contentType },
        body,
    });
}

describe("onRequestPost /api/ai/transcribe", () => {
    beforeEach(() => {
        requireUser.mockReset();
        vi.unstubAllGlobals();
    });

    it("returns 401 when requireUser rejects", async () => {
        requireUser.mockRejectedValue(new Error("no auth"));
        const res = await onRequestPost({ request: makeRequest(new Uint8Array([1, 2, 3])), env: ENV });
        expect(res.status).toBe(401);
    });

    it("returns 400 when no audio bytes are sent", async () => {
        requireUser.mockResolvedValue("uid-1");
        const res = await onRequestPost({ request: makeRequest(null), env: ENV });
        expect(res.status).toBe(400);
    });

    it("returns 413 when the audio exceeds the size cap", async () => {
        requireUser.mockResolvedValue("uid-1");
        const oversized = new Uint8Array(20 * 1024 * 1024 + 1);
        const res = await onRequestPost({ request: makeRequest(oversized), env: ENV });
        expect(res.status).toBe(413);
    });

    it("forwards audio to Groq and returns the transcript", async () => {
        requireUser.mockResolvedValue("uid-1");
        const fetchMock = vi.fn().mockResolvedValue(
            new Response(JSON.stringify({ text: "  hello world  " }), { status: 200 })
        );
        vi.stubGlobal("fetch", fetchMock);

        const res = await onRequestPost({ request: makeRequest(new Uint8Array([1, 2, 3])), env: ENV });

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ text: "hello world" });
        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.groq.com/openai/v1/audio/transcriptions",
            expect.objectContaining({ method: "POST" })
        );
    });
});
