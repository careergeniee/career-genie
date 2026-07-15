# Port AI API to Cloudflare Pages Functions Implementation Plan

> **STATUS: ABANDONED.** This plan was fully implemented (the `functions/` tree existed with all handlers below), then reverted in commit `af8fe2f` ("fix: point Cloudflare Pages frontend at the working Vercel AI proxy"). Groq blocks Cloudflare Workers' IP ranges at the network level (confirmed via live testing + community.groq.com/t/ip-address-range-blocked-by-cloudflare/728) — calling Groq directly from a Cloudflare Pages Function returns 403 regardless of auth/key correctness, with no fix available on our end. This is an unfixable platform constraint, not a bug — **do not re-attempt this plan.** The current, working architecture (Cloudflare Pages frontend calling the Vercel `api/ai/*` proxy cross-origin via CORS) is documented in `README.md` § Deployments. This file is kept for historical context only.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the AI chatbot and voice transcription work on the Cloudflare Pages deployment (`career-genie.pages.dev`) by porting the existing Vercel serverless functions (`api/ai/complete.ts`, `api/ai/transcribe.ts`, `api/_lib/auth.ts`) to Cloudflare Pages Functions.

**Architecture:** Cloudflare Pages auto-detects a `functions/` directory at the project root and maps files under it to routes the same way Vercel maps `api/`. We add a parallel `functions/api/` tree with the same two endpoints. Cloudflare Pages Functions use the standard Fetch API (`Request` in, `Response` out via an exported `onRequestPost`) instead of Vercel's `(req, res)` signature, so each handler is rewritten rather than copied. `firebase-admin` (used for auth on Vercel) is not reliably supported on the Workers runtime, so Firebase ID token verification is reimplemented by hand using `jose` to verify the token against Google's public JWKS — `jose` is fully ESM and Workers-native, so none of the CommonJS/ESM crash we just fixed on Vercel applies here.

**Tech Stack:** Cloudflare Pages Functions (Workers runtime), TypeScript, `jose` for JWT verification, Vitest for tests, raw `fetch` calls to Groq's REST API (no SDK, matching the existing `transcribe.ts` pattern).

## Global Constraints

- Preserve the existing `/api/ai/complete` and `/api/ai/transcribe` request/response contracts exactly (status codes and JSON shapes) — `src/lib/ai.ts` is shared by both deployments and must work unchanged against either backend.
- Do not modify the existing `api/` directory (Vercel) — this is a purely additive `functions/` tree for Cloudflare.
- No `@cloudflare/workers-types` dependency and no new tsconfig for `functions/` — use the ambient DOM Fetch API types (`Request`, `Response`, `Headers`, `FormData`, `Blob`) already available via `tsconfig.app.json`'s `"lib": [..., "DOM"]`, consistent with how `api/` is already excluded from the root `tsc -b` project references.
- Do not use `firebase-admin` in `functions/` — verify Firebase ID tokens manually with `jose` against `https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`.
- No real network calls in tests — mock `jose` and global `fetch`.
- Package manager is `bun` (project uses `bun.lock`) — use `bun add`/`bun install`, not `npm`/`yarn`.

---

## File Structure

- Create: `functions/api/_lib/http.ts` — shared `jsonResponse(status, body)` helper returning a `Response`.
- Create: `functions/api/_lib/http.test.ts`
- Create: `functions/api/_lib/auth.ts` — `AuthError` class + `requireUser(request, projectId)`, manual Firebase ID token verification via `jose`.
- Create: `functions/api/_lib/auth.test.ts`
- Create: `functions/api/ai/complete.ts` — `onRequestPost` chat completion proxy to Groq.
- Create: `functions/api/ai/complete.test.ts`
- Create: `functions/api/ai/transcribe.ts` — `onRequestPost` audio transcription proxy to Groq.
- Create: `functions/api/ai/transcribe.test.ts`
- Modify: `vitest.config.ts` — broaden `test.include` to also pick up `functions/**/*.test.ts`.
- Modify: `package.json` — add `jose` as a direct dependency.
- Modify: `.gitignore` — ignore `.wrangler/` (local Cloudflare dev cache).

Note: Cloudflare Pages Functions ignore files/directories whose name starts with `_` for routing purposes, so `functions/api/_lib/*` will not become a route — this mirrors the existing `api/_lib/` convention on Vercel.

---

### Task 1: Shared JSON response helper

**Files:**
- Create: `functions/api/_lib/http.ts`
- Test: `functions/api/_lib/http.test.ts`
- Modify: `vitest.config.ts:11` (broaden `include`)

**Interfaces:**
- Produces: `jsonResponse(status: number, body: unknown): Response` — used by every handler in later tasks.

- [ ] **Step 1: Broaden the Vitest include glob**

Edit `vitest.config.ts` so `test.include` also matches function tests:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}", "functions/**/*.{test,spec}.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

- [ ] **Step 2: Write the failing test**

Create `functions/api/_lib/http.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { jsonResponse } from "./http";

describe("jsonResponse", () => {
    it("sets the status code and a JSON content-type header", async () => {
        const res = jsonResponse(201, { hello: "world" });
        expect(res.status).toBe(201);
        expect(res.headers.get("Content-Type")).toBe("application/json");
        expect(await res.json()).toEqual({ hello: "world" });
    });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `bunx vitest run functions/api/_lib/http.test.ts`
Expected: FAIL — `functions/api/_lib/http.ts` does not exist (`Cannot find module './http'`).

- [ ] **Step 4: Write minimal implementation**

Create `functions/api/_lib/http.ts`:

```ts
export function jsonResponse(status: number, body: unknown): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `bunx vitest run functions/api/_lib/http.test.ts`
Expected: PASS (1 test)

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts functions/api/_lib/http.ts functions/api/_lib/http.test.ts
git commit -m "feat: add shared JSON response helper for Cloudflare Pages Functions"
```

---

### Task 2: Firebase ID token verification (`requireUser`)

**Files:**
- Create: `functions/api/_lib/auth.ts`
- Test: `functions/api/_lib/auth.test.ts`
- Modify: `package.json` (add `jose` dependency)

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `AuthError` (class extends `Error`), `requireUser(request: Request, projectId: string): Promise<string>` — resolves to the Firebase `uid`, rejects with `AuthError` on any failure. Used by Tasks 3 and 4.

- [ ] **Step 1: Add the `jose` dependency**

```bash
bun add jose
```

This adds `jose` (currently 6.2.3, fully ESM) as a direct dependency. It resolves independently of the `jwks-rsa` override already in `package.json` — `jwks-rsa` keeps its own nested `jose@^4` for Node/Vercel, this new top-level `jose` is only used by `functions/`, and Cloudflare Workers has no CommonJS `require()` step so the ESM-only version is not a problem there.

- [ ] **Step 2: Write the failing tests**

Create `functions/api/_lib/auth.test.ts`:

```ts
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `bunx vitest run functions/api/_lib/auth.test.ts`
Expected: FAIL — `functions/api/_lib/auth.ts` does not exist.

- [ ] **Step 4: Write minimal implementation**

Create `functions/api/_lib/auth.ts`:

```ts
import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

export class AuthError extends Error {}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function getJwks() {
    if (!jwks) jwks = createRemoteJWKSet(new URL(JWKS_URL));
    return jwks;
}

/** Verifies the caller's Firebase ID token from the Authorization header. Throws AuthError if missing/invalid. */
export async function requireUser(request: Request, projectId: string): Promise<string> {
    const header = request.headers.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) throw new AuthError("Missing Authorization header");

    let payload;
    try {
        ({ payload } = await jwtVerify(token, getJwks(), {
            issuer: `https://securetoken.google.com/${projectId}`,
            audience: projectId,
            algorithms: ["RS256"],
        }));
    } catch {
        throw new AuthError("Invalid or expired token");
    }

    if (!payload.sub) throw new AuthError("Invalid token: missing subject");
    return payload.sub;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `bunx vitest run functions/api/_lib/auth.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 6: Commit**

```bash
git add package.json bun.lock functions/api/_lib/auth.ts functions/api/_lib/auth.test.ts
git commit -m "feat: verify Firebase ID tokens on Cloudflare via jose against Google's public JWKS"
```

---

### Task 3: `/api/ai/complete` on Cloudflare Pages Functions

**Files:**
- Create: `functions/api/ai/complete.ts`
- Test: `functions/api/ai/complete.test.ts`

**Interfaces:**
- Consumes: `requireUser`, `AuthError` from `../_lib/auth.js` (Task 2); `jsonResponse` from `../_lib/http.js` (Task 1).
- Produces: `onRequestPost` matching Cloudflare Pages Functions' handler contract — `(context: { request: Request; env: { GROQ_API_KEY: string; FIREBASE_PROJECT_ID: string } }) => Promise<Response>`.

- [ ] **Step 1: Write the failing tests**

Create `functions/api/ai/complete.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bunx vitest run functions/api/ai/complete.test.ts`
Expected: FAIL — `functions/api/ai/complete.ts` does not exist.

- [ ] **Step 3: Write minimal implementation**

Create `functions/api/ai/complete.ts`:

```ts
import { requireUser } from "../_lib/auth.js";
import { jsonResponse } from "../_lib/http.js";

interface Env {
    GROQ_API_KEY: string;
    FIREBASE_PROJECT_ID: string;
}

interface Context {
    request: Request;
    env: Env;
}

const MODEL = "llama-3.3-70b-versatile";

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
    try {
        await requireUser(request, env.FIREBASE_PROJECT_ID);
    } catch {
        return jsonResponse(401, { error: "Unauthorized" });
    }

    const body = (await request.json().catch(() => null)) as {
        messages?: unknown;
        temperature?: number;
        maxTokens?: number;
        jsonMode?: boolean;
    } | null;
    const messages = body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
        return jsonResponse(400, { error: "messages is required" });
    }

    try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL,
                messages,
                temperature: typeof body?.temperature === "number" ? body.temperature : 0.6,
                max_tokens: typeof body?.maxTokens === "number" ? body.maxTokens : 1500,
                ...(body?.jsonMode ? { response_format: { type: "json_object" } } : {}),
            }),
        });
        if (!groqRes.ok) {
            return jsonResponse(groqRes.status, { error: "AI request failed" });
        }
        const data = (await groqRes.json()) as { choices?: { message?: { content?: string } }[] };
        const content = data.choices?.[0]?.message?.content || "";
        return jsonResponse(200, { content });
    } catch {
        return jsonResponse(502, { error: "AI request failed" });
    }
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bunx vitest run functions/api/ai/complete.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add functions/api/ai/complete.ts functions/api/ai/complete.test.ts
git commit -m "feat: port /api/ai/complete to Cloudflare Pages Functions"
```

---

### Task 4: `/api/ai/transcribe` on Cloudflare Pages Functions

**Files:**
- Create: `functions/api/ai/transcribe.ts`
- Test: `functions/api/ai/transcribe.test.ts`

**Interfaces:**
- Consumes: `requireUser` from `../_lib/auth.js` (Task 2); `jsonResponse` from `../_lib/http.js` (Task 1).
- Produces: `onRequestPost` matching the same Cloudflare Pages Functions contract as Task 3.

- [ ] **Step 1: Write the failing tests**

Create `functions/api/ai/transcribe.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bunx vitest run functions/api/ai/transcribe.test.ts`
Expected: FAIL — `functions/api/ai/transcribe.ts` does not exist.

- [ ] **Step 3: Write minimal implementation**

Create `functions/api/ai/transcribe.ts`:

```ts
import { requireUser } from "../_lib/auth.js";
import { jsonResponse } from "../_lib/http.js";

interface Env {
    GROQ_API_KEY: string;
    FIREBASE_PROJECT_ID: string;
}

interface Context {
    request: Request;
    env: Env;
}

// Cloudflare Pages enforces its own (larger) request body limit at the edge; this
// is a defense-in-depth cap on top of that, matching the Vercel function's limit.
const MAX_BYTES = 20 * 1024 * 1024;

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
    try {
        await requireUser(request, env.FIREBASE_PROJECT_ID);
    } catch {
        return jsonResponse(401, { error: "Unauthorized" });
    }

    const mimeType = request.headers.get("content-type") || "audio/webm";
    const buffer = await request.arrayBuffer();
    if (buffer.byteLength === 0) {
        return jsonResponse(400, { error: "No audio received" });
    }
    if (buffer.byteLength > MAX_BYTES) {
        return jsonResponse(413, { error: "Audio too large" });
    }

    const ext = mimeType.includes("ogg") ? "ogg" : mimeType.includes("mp4") ? "mp4" : "webm";
    const form = new FormData();
    form.append("file", new Blob([buffer], { type: mimeType }), `voice.${ext}`);
    form.append("model", "whisper-large-v3-turbo");

    try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: { Authorization: `Bearer ${env.GROQ_API_KEY}` },
            body: form,
        });
        if (!groqRes.ok) {
            return jsonResponse(groqRes.status, { error: "Transcription failed" });
        }
        const data = (await groqRes.json()) as { text: string };
        return jsonResponse(200, { text: (data.text || "").trim() });
    } catch {
        return jsonResponse(502, { error: "Transcription service unavailable" });
    }
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bunx vitest run functions/api/ai/transcribe.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add functions/api/ai/transcribe.ts functions/api/ai/transcribe.test.ts
git commit -m "feat: port /api/ai/transcribe to Cloudflare Pages Functions"
```

---

### Task 5: Full-suite verification, gitignore, and deployment

**Files:**
- Modify: `.gitignore` (ignore `.wrangler/`)

**Interfaces:**
- Consumes: everything from Tasks 1-4.
- Produces: nothing further downstream — this is the final integration/deploy task.

- [ ] **Step 1: Ignore Cloudflare's local dev cache**

Add to `.gitignore` (append near the existing `.vercel` line):

```
.wrangler
```

- [ ] **Step 2: Run the full test suite**

Run: `bun run test`
Expected: All tests pass, including the 14 new tests across `functions/api/_lib/http.test.ts`, `functions/api/_lib/auth.test.ts`, `functions/api/ai/complete.test.ts`, `functions/api/ai/transcribe.test.ts`.

- [ ] **Step 3: Run typecheck to confirm `functions/` doesn't break the existing project**

Run: `bun run typecheck`
Expected: PASS with no errors (identical to before this plan — `functions/` isn't part of the `tsc -b` project references, same as `api/`).

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore local wrangler dev cache"
```

- [ ] **Step 5: Push and let Cloudflare Pages auto-deploy**

```bash
git push origin main
```

Cloudflare Pages is already connected to this repo (it built `career-genie.pages.dev` from a previous push), so pushing to `main` triggers a new build that will now pick up the `functions/` directory automatically — no `wrangler.toml` is needed for this to work.

- [ ] **Step 6: Set the required environment variables on Cloudflare Pages**

The Cloudflare Pages project needs two environment variables that the Vercel project already has — add them via the Cloudflare dashboard (Pages project → Settings → Environment variables → Production) or via Wrangler if authenticated:

```bash
npx wrangler login
npx wrangler pages secret put GROQ_API_KEY --project-name=career-genie
npx wrangler pages secret put FIREBASE_PROJECT_ID --project-name=career-genie
```

Note: unlike the Vercel deployment, Cloudflare only needs `FIREBASE_PROJECT_ID` — it does **not** need `FIREBASE_CLIENT_EMAIL` or `FIREBASE_PRIVATE_KEY`, since token verification here uses Google's public JWKS instead of a service account.

- [ ] **Step 7: Verify against the live deployment**

Wait for the Cloudflare Pages build to finish (check in the dashboard, or `npx wrangler pages deployment list --project-name=career-genie`), then:

```bash
curl -s -o /dev/null -w "HTTP_STATUS:%{http_code}\n" -X POST https://career-genie.pages.dev/api/ai/complete \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hi"}]}'
```

Expected: `HTTP_STATUS:401` (unauthorized, because no token was sent — this confirms the function loaded and ran, matching how the Vercel fix was verified). Then open `https://career-genie.pages.dev/dashboard/chat` while signed in and confirm the chatbot responds normally.

---

## Self-Review

**Spec coverage:** Both endpoints (`complete`, `transcribe`) and the shared auth helper are ported (Tasks 2-4); routing/config concerns (`_lib` exclusion, no `wrangler.toml` needed) are covered in the File Structure notes and Task 5; environment variable setup and live verification are explicit steps in Task 5.

**Placeholder scan:** All test and implementation code is complete and runnable — no TODOs or "add appropriate X" stand-ins.

**Type consistency:** `Env` (`GROQ_API_KEY`, `FIREBASE_PROJECT_ID`) and `Context` (`request`, `env`) shapes are identical across `complete.ts` and `transcribe.ts`. `requireUser(request: Request, projectId: string): Promise<string>` signature matches between its definition (Task 2) and both call sites (Tasks 3-4). `jsonResponse(status: number, body: unknown): Response` matches between definition (Task 1) and all call sites.
