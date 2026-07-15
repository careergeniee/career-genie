import { describe, it, expect, vi, beforeEach } from "vitest";

const { jwtVerify } = vi.hoisted(() => ({ jwtVerify: vi.fn() }));
vi.mock("jose", () => ({
    createRemoteJWKSet: vi.fn(() => "mock-jwks"),
    jwtVerify,
}));

import { requireUser, AuthError } from "./auth";

const PROJECT_ID = "test-project";

function requestWithAuth(header?: string) {
    const headers = new Headers();
    if (header !== undefined) headers.set("authorization", header);
    return new Request("https://example.com/api/ai/complete", { headers });
}

describe("requireUser", () => {
    beforeEach(() => {
        jwtVerify.mockReset();
    });

    it("throws AuthError when the Authorization header is missing", async () => {
        await expect(requireUser(requestWithAuth(), PROJECT_ID)).rejects.toThrow(AuthError);
    });

    it("throws AuthError when the header isn't a Bearer token", async () => {
        await expect(requireUser(requestWithAuth("Basic abc123"), PROJECT_ID)).rejects.toThrow(AuthError);
    });

    it("throws AuthError when jose fails to verify the token", async () => {
        jwtVerify.mockRejectedValue(new Error("signature invalid"));
        await expect(requireUser(requestWithAuth("Bearer bad-token"), PROJECT_ID)).rejects.toThrow(AuthError);
    });

    it("throws AuthError when the verified payload has no subject", async () => {
        jwtVerify.mockResolvedValue({ payload: {} });
        await expect(requireUser(requestWithAuth("Bearer good-token"), PROJECT_ID)).rejects.toThrow(AuthError);
    });

    it("returns the uid when the token verifies successfully", async () => {
        jwtVerify.mockResolvedValue({ payload: { sub: "user-123" } });
        await expect(requireUser(requestWithAuth("Bearer good-token"), PROJECT_ID)).resolves.toBe("user-123");
    });
});
