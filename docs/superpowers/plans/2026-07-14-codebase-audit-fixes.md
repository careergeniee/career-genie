# CareerGenie Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the critical/high/medium/low findings from the full-codebase audit (correctness bugs, security issues, dead code/duplication), including moving all Groq LLM calls behind an authenticated backend proxy so the API key stops shipping to the browser.

**Architecture:** No new frontend framework choices. Adds one new surface: Vercel Serverless Functions under `api/` (the app is already deployed on Vercel — see `vercel.json`) that hold `GROQ_API_KEY` server-side and verify the caller's Firebase ID token via `firebase-admin` before proxying to Groq. All existing `aiText`/`aiJson` call sites in `src/lib/*` and pages are unchanged — only `src/lib/ai.ts`'s internals, `Chat.tsx`, and `useVoiceRecorder.ts` are rewired to call the proxy instead of the Groq SDK directly.

**Tech Stack:** React 18 + TypeScript + Vite (frontend, unchanged), Vercel Serverless Functions with `@vercel/node` (new), `firebase-admin` (new, server-only), `groq-sdk` (moves from client to server-only usage), Firestore Security Rules (new file, user deploys).

## Global Constraints

- Do not change any public function signatures in `src/lib/ai.ts` (`aiText`, `aiJson`) except adding a new `aiChat` export — every existing call site (`Careers.tsx`, `Resume.tsx`, `interview.ts`, `resume.ts`, `roadmap.ts`, `instructor.ts`) must keep working unmodified.
- Never introduce a `VITE_`-prefixed env var that holds a secret — anything with `VITE_` prefix ships to the browser bundle by Vite's design.
- `npx tsc -b --noEmit`, `npx eslint .`, and `npx vitest run` must all stay clean (0 errors) after every task.
- Preserve existing UX strings/behavior unless the task explicitly says to change them (e.g. keep the 429 "sending messages too fast" message in Chat.tsx).
- This repo has no test coverage for React components or API routes — verification for UI-behavior tasks is manual (documented per task), not a new automated test, unless the task touches a pure function already covered by `src/test/`.

---

## Phase 1 — Critical (data integrity & access control)

### Task 1: Fix Settings.tsx's broken "clear data" buttons

**Files:**
- Modify: `src/pages/dashboard/Settings.tsx:22-75`

**Problem:** `DATA_KEYS` uses key names (`cg_chat`, `cg_roadmap`, `resume`, etc.) that don't match the real storage format `cg:<uid>:<key>` produced by `fullKey()` in `src/lib/userStore.ts:44`. Every "Clear" button shows a success toast while leaving all data intact.

- [ ] **Step 1: Reuse the real storage keys and the existing correct clear helper**

Replace the `DATA_KEYS` array and `clearKey`/`clearAll` functions:

```tsx
import { Settings, User, Trash2, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { KEYS, removeData } from "@/lib/userStore";

// ...

const DATA_KEYS: { key: keyof typeof KEYS; label: string }[] = [
    { key: "chat", label: "Chat history" },
    { key: "interviewSessions", label: "Interview sessions" },
    { key: "resume", label: "Resume data" },
    { key: "resumeTemplate", label: "Resume template preference" },
    { key: "resumeRole", label: "ATS target role" },
    { key: "assessment", label: "Career assessment answers" },
    { key: "prediction", label: "Career prediction results" },
    { key: "roadmap", label: "Career roadmap" },
    { key: "instructorTasks", label: "Instructor progress" },
];
```

```tsx
    const clearKey = (key: keyof typeof KEYS, label: string) => {
        removeData(KEYS[key]);
        setCleared((prev) => [...prev, key]);
        toast.success(`${label} cleared`);
    };

    const clearAll = () => {
        if (!window.confirm("Clear ALL your data? This cannot be undone.")) return;
        DATA_KEYS.forEach(({ key }) => removeData(KEYS[key]));
        setCleared(DATA_KEYS.map((d) => d.key));
        toast.success("All local data cleared");
    };
```

Update the `cleared` state type from `useState<string[]>([])` to `useState<(keyof typeof KEYS)[]>([])` and the `.map`/`.includes` usages in JSX (`cleared.includes(key)`) keep working unchanged since they now compare the same `keyof typeof KEYS` type.

Note this only clears **localStorage**. It intentionally does not touch the Firestore mirror (`users/{uid}` doc) — that's a separate, larger "delete my cloud data" feature not in scope here. Update the section's helper text to be accurate:

```tsx
<p className="text-xs text-muted-foreground mb-4">
    Clears data stored locally in this browser. Clear individual sections or everything at once.
</p>
```

- [ ] **Step 2: Verify**

Run `npx tsc -b --noEmit` (must stay clean). Then manually: `npm run dev`, log in, generate some chat messages and a resume, go to Settings, click "Clear" on "Chat history" — reload the Chat page and confirm the conversation reset to the default greeting (i.e. `localStorage.getItem('cg:<uid>:chat')` is gone). Click "Clear all data" and confirm resume/roadmap pages also reset.

- [ ] **Step 3: Commit**

```bash
git add src/pages/dashboard/Settings.tsx
git commit -m "fix: Settings 'clear data' buttons now clear the actual storage keys"
```

---

### Task 2: Remove the unauthenticated `/dev-chat-preview` route

**Files:**
- Modify: `src/App.tsx:90`

**Problem:** This route renders `ChatPage` outside `PrivateRoute`, so anyone can use the AI chat (and consume Groq quota) without logging in. It's a leftover dev route — the real chat is already reachable at `/dashboard/chat` for signed-in users.

- [ ] **Step 1: Delete the route**

Remove this line entirely:
```tsx
<Route path="/dev-chat-preview" element={<ChatPage />} />
```

Also remove the now-unused `ChatPage` import at the top of `App.tsx` if the route table's only reference to it was this line (check: `<Route path="chat" element={<ChatPage />} />` inside the `/dashboard` block should still reference it — if so, keep the import).

- [ ] **Step 2: Verify**

`npx tsc -b --noEmit` clean (catches the import if it becomes unused... note `noUnusedLocals` is `false` in this repo's tsconfig, so also manually confirm via `grep -n "dev-chat-preview" src/App.tsx` returns nothing). Manually: `npm run dev`, navigate to `http://localhost:5173/dev-chat-preview` while logged out — confirm it now 404s (falls through to the `*` → `NotFound` route) instead of loading chat.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "fix: remove unauthenticated dev-chat-preview route"
```

---

### Task 3: Stop `initUserData()` from clobbering fresh local writes on token refresh

**Files:**
- Modify: `src/contexts/AuthContext.tsx:40-60`

**Problem:** `onAuthStateChanged` fires on every token refresh (roughly hourly), not just on login, and each firing calls `initUserData()` which unconditionally overwrites localStorage from Firestore. Since `saveData()` mirrors to Firestore fire-and-forget, a refresh landing between a local write and its Firestore mirror completing rolls the user's data back to a stale cloud copy.

- [ ] **Step 1: Only hydrate once per signed-in session, on the actual sign-in transition**

```tsx
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hydratedUidRef = useRef<string | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(
            auth,
            (u) => {
                setUser(u);
                setError(null);
                setLoading(false);
                if (u && hydratedUidRef.current !== u.uid) {
                    // Hydrate localStorage from Firestore once per sign-in — not on every
                    // token refresh, which would race with and clobber any local write made
                    // since the last Firestore mirror (saveData's Firestore write is fire-and-forget).
                    hydratedUidRef.current = u.uid;
                    initUserData().catch(() => {});
                }
                if (!u) {
                    hydratedUidRef.current = null;
                }
            },
            (err) => {
                console.error("CareerGenie: auth state listener failed —", err);
                setError(err.message);
                setLoading(false);
            }
        );
        return unsub;
    }, []);
```

Add `useRef` to the existing `react` import at the top of the file.

- [ ] **Step 2: Verify**

`npx tsc -b --noEmit` clean. Manually: log in, edit the resume (triggers `saveData`), wait a couple seconds for the Firestore mirror, then in devtools call `auth.currentUser.getIdToken(true)` in the console (forces a token refresh → fires `onAuthStateChanged` again) and confirm the resume data in `localStorage` is untouched (previously it would re-fetch and overwrite, which is hard to see going wrong unless you catch it mid-race — the important regression check is that `initUserData` is only called once per session: add a temporary `console.log` before/after the fix to confirm call count across a refresh, then remove it).

- [ ] **Step 3: Commit**

```bash
git add src/contexts/AuthContext.tsx
git commit -m "fix: hydrate localStorage from Firestore once per sign-in, not on every token refresh"
```

---

### Task 4: Add `firestore.rules` to the repo

**Files:**
- Create: `firestore.rules`
- Create: `firebase.json` (only if one doesn't already exist at repo root — confirmed it doesn't)

**Problem:** No rules file exists in the repo, so there's no way to verify from source control that `users/{userId}` documents are locked to their owner. The client fully trusts server-side rules for cross-user isolation.

- [ ] **Step 1: Write rules scoping each user doc to its owner**

`firestore.rules`:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

`firebase.json`:
```json
{
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

- [ ] **Step 2: Verify**

This can't be verified by the app's own test suite — it has to be deployed. **You (the user) need to run:**
```bash
firebase deploy --only firestore:rules
```
(requires `firebase-tools` CLI and being logged into the correct Firebase project — `firebase login` / `firebase use <project-id>` first if not already configured). After deploying, confirm in the Firebase Console → Firestore → Rules tab that it matches this file, and that the "Rules Playground" simulates: user A reading `users/B` → denied; user A reading `users/A` → allowed.

- [ ] **Step 3: Commit**

```bash
git add firestore.rules firebase.json
git commit -m "security: add Firestore rules restricting users/{uid} docs to their owner"
```

---

## Phase 2 — Critical: move Groq off the client

This is the largest change in the plan. It adds Vercel Serverless Functions that hold `GROQ_API_KEY` server-side and require a valid Firebase ID token before proxying to Groq.

**Before starting, tell the user:** this requires manual setup they must do outside the repo:
1. Generate a Firebase service-account key: Firebase Console → Project Settings → Service Accounts → "Generate new private key" (downloads a JSON file).
2. In the Vercel project's dashboard → Settings → Environment Variables, add: `GROQ_API_KEY` (the existing Groq key, just renamed/moved — no `VITE_` prefix), `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (from the downloaded JSON's `project_id`/`client_email`/`private_key` fields — paste the private key including the `BEGIN/END PRIVATE KEY` lines; Vercel's dashboard preserves literal newlines, and the code below also handles an escaped `\n` variant for local `.env` use).
3. Remove `VITE_GROQ_API_KEY` from the Vercel project's env vars once Task 8 ships, so it stops being bundled.
4. Locally, `npx vercel dev` (not `npm run dev`) is needed to serve `/api/*` routes during development — plain `vite dev` won't run serverless functions.

### Task 5: Scaffold Vercel functions + Firebase Admin auth helper

**Files:**
- Create: `api/_lib/auth.ts`
- Modify: `package.json` (add `firebase-admin` dependency, `@vercel/node` dev dependency)
- Modify: `.env.example`

**Interfaces:**
- Produces: `requireUser(req: VercelRequest): Promise<string>` — resolves to the caller's Firebase `uid` or throws `AuthError`. Used by both Task 6 and Task 7's handlers.

- [ ] **Step 1: Install dependencies**

```bash
npm install firebase-admin
npm install -D @vercel/node
```

- [ ] **Step 2: Write the auth helper**

`api/_lib/auth.ts`:
```ts
import type { VercelRequest } from "@vercel/node";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export class AuthError extends Error {}

function adminAuth() {
    if (!getApps().length) {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
            }),
        });
    }
    return getAuth();
}

/** Verifies the caller's Firebase ID token from the Authorization header. Throws AuthError if missing/invalid. */
export async function requireUser(req: VercelRequest): Promise<string> {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) throw new AuthError("Missing Authorization header");
    try {
        const decoded = await adminAuth().verifyIdToken(token);
        return decoded.uid;
    } catch {
        throw new AuthError("Invalid or expired token");
    }
}
```

- [ ] **Step 3: Update `.env.example`**

Replace the Groq section:
```
# Groq LLM API key — SERVER-SIDE ONLY. Used by api/ai/*.ts. Never prefix with VITE_.
GROQ_API_KEY=your_groq_api_key_here

# Firebase service account (Project Settings > Service Accounts > Generate new private key).
# SERVER-SIDE ONLY — used by api/_lib/auth.ts to verify ID tokens.
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Remove the old `VITE_GROQ_API_KEY=your_groq_api_key_here` line.

- [ ] **Step 4: Verify**

`npx tsc -b --noEmit` (the `api/` directory isn't in `tsconfig.app.json`'s `include: ["src"]`, so this won't type-check `api/` yet — that's expected and fine; Vercel type-checks/transpiles functions independently at build/deploy time). Confirm `npm install` completed without errors and `firebase-admin`/`@vercel/node` appear in `package.json`.

- [ ] **Step 5: Commit**

```bash
git add api/_lib/auth.ts package.json package-lock.json .env.example
git commit -m "feat: scaffold Vercel serverless functions with Firebase Admin auth verification"
```

---

### Task 6: Build `/api/ai/complete` and rewrite `src/lib/ai.ts`

**Files:**
- Create: `api/ai/complete.ts`
- Modify: `src/lib/ai.ts` (full rewrite of internals; public `aiText`/`aiJson` signatures unchanged, new `aiChat` export added)

**Interfaces:**
- Consumes: `requireUser` from `api/_lib/auth.ts` (Task 5).
- Produces: `aiChat(messages: {role: "system"|"user"|"assistant"; content: string}[], opts?: {temperature?: number; maxTokens?: number}): Promise<string>` — new export, consumed by Task 8 (Chat.tsx).

- [ ] **Step 1: Write the serverless endpoint**

`api/ai/complete.ts`:
```ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";
import { requireUser } from "../_lib/auth";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        await requireUser(req);
    } catch {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const { messages, temperature, maxTokens, jsonMode } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "messages is required" });
        return;
    }

    try {
        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages,
            temperature: typeof temperature === "number" ? temperature : 0.6,
            max_tokens: typeof maxTokens === "number" ? maxTokens : 1500,
            ...(jsonMode ? { response_format: { type: "json_object" as const } } : {}),
        });
        const content = completion.choices[0]?.message?.content || "";
        res.status(200).json({ content });
    } catch (err) {
        const status = (err as { status?: number })?.status ?? 500;
        res.status(status).json({ error: "AI request failed" });
    }
}
```

- [ ] **Step 2: Rewrite `src/lib/ai.ts`**

```ts
import { auth } from "@/lib/firebase";

const AI_TIMEOUT_MS = 30000;

/** Reject if a promise takes longer than `ms`. */
function withTimeout<T>(p: Promise<T>, ms: number, label = "AI request"): Promise<T> {
    return Promise.race([
        p,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`${label} timed out`)), ms)
        ),
    ]);
}

export class AiProxyError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function callProxy(
    messages: ChatMessage[],
    opts: { temperature?: number; maxTokens?: number; jsonMode?: boolean } = {}
): Promise<string> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new AiProxyError(401, "Not signed in");

    const res = await withTimeout(
        fetch("/api/ai/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                messages,
                temperature: opts.temperature,
                maxTokens: opts.maxTokens,
                jsonMode: opts.jsonMode,
            }),
        }),
        AI_TIMEOUT_MS
    );
    if (!res.ok) throw new AiProxyError(res.status, `AI proxy returned ${res.status}`);
    const data = (await res.json()) as { content: string };
    return data.content || "";
}

/** Multi-turn chat completion — caller supplies the full message list. */
export async function aiChat(
    messages: ChatMessage[],
    opts: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
    return callProxy(messages, opts);
}

/** Plain text completion (with one retry and a timeout). */
export async function aiText(
    system: string,
    user: string,
    opts: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
    const messages: ChatMessage[] = [
        { role: "system", content: system },
        { role: "user", content: user },
    ];
    try {
        return await callProxy(messages, opts);
    } catch {
        try {
            return await callProxy(messages, opts); // single retry on timeout/transient error
        } catch {
            return "";
        }
    }
}

/**
 * Pull the first valid JSON value out of an LLM response, tolerating
 * ```json fences, leading prose, or trailing commentary.
 */
function extractJson<T>(raw: string): T {
    let text = raw.trim();

    const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) text = fence[1].trim();

    const firstObj = text.indexOf("{");
    const firstArr = text.indexOf("[");
    const start =
        firstArr === -1
            ? firstObj
            : firstObj === -1
            ? firstArr
            : Math.min(firstObj, firstArr);
    if (start !== -1) {
        const lastObj = text.lastIndexOf("}");
        const lastArr = text.lastIndexOf("]");
        const end = Math.max(lastObj, lastArr);
        if (end > start) text = text.slice(start, end + 1);
    }

    return JSON.parse(text) as T;
}

/**
 * Ask the model for structured JSON and parse it. Forces JSON response mode
 * and retries once at temperature 0 if the first parse fails.
 */
export async function aiJson<T>(
    system: string,
    user: string,
    opts: { temperature?: number; maxTokens?: number } = {}
): Promise<T> {
    const run = (temperature: number) =>
        callProxy(
            [
                {
                    role: "system",
                    content:
                        system +
                        "\n\nRespond with ONLY valid JSON. No markdown, no commentary, no code fences.",
                },
                { role: "user", content: user },
            ],
            { ...opts, temperature, jsonMode: true }
        );

    try {
        return extractJson<T>(await run(opts.temperature ?? 0.5));
    } catch {
        return extractJson<T>(await run(0));
    }
}
```

- [ ] **Step 3: Verify**

`npx tsc -b --noEmit` and `npx vitest run` must stay clean (no test currently exercises `ai.ts` directly, but `careerEngine.test.ts`/`userStore.test.ts` must not regress). Manually with `npx vercel dev`: log in, go to Careers page, select a career, confirm the AI explanation text still loads (exercises `aiText`); go to Roadmap, generate a roadmap (exercises `aiJson`). Open devtools Network tab and confirm requests go to `/api/ai/complete` with an `Authorization: Bearer …` header — **not** to `api.groq.com` directly, and confirm no `groq` API key string appears anywhere in the response or request body sent from the browser.

- [ ] **Step 4: Commit**

```bash
git add api/ai/complete.ts src/lib/ai.ts
git commit -m "feat: proxy AI text/JSON completions through an authenticated serverless endpoint"
```

---

### Task 7: Build `/api/ai/transcribe` and rewrite `useVoiceRecorder.ts`

**Files:**
- Create: `api/ai/transcribe.ts`
- Modify: `src/hooks/useVoiceRecorder.ts:1-21` (only the `transcribeAudio` function changes)

- [ ] **Step 1: Write the serverless endpoint**

`api/ai/transcribe.ts`:
```ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireUser } from "../_lib/auth";

export const config = { api: { bodyParser: false } };

const MAX_BYTES = 20 * 1024 * 1024; // 20MB — well under Vercel's request body ceiling

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    try {
        await requireUser(req);
    } catch {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const mimeType = req.headers["content-type"] || "audio/webm";
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req) {
        size += (chunk as Buffer).length;
        if (size > MAX_BYTES) {
            res.status(413).json({ error: "Audio too large" });
            return;
        }
        chunks.push(chunk as Buffer);
    }
    const buffer = Buffer.concat(chunks);
    if (buffer.length === 0) {
        res.status(400).json({ error: "No audio received" });
        return;
    }

    const ext = mimeType.includes("ogg") ? "ogg" : mimeType.includes("mp4") ? "mp4" : "webm";
    const form = new FormData();
    form.append("file", new Blob([buffer], { type: mimeType }), `voice.${ext}`);
    form.append("model", "whisper-large-v3-turbo");

    try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
            body: form,
        });
        if (!groqRes.ok) {
            res.status(groqRes.status).json({ error: "Transcription failed" });
            return;
        }
        const data = (await groqRes.json()) as { text: string };
        res.status(200).json({ text: (data.text || "").trim() });
    } catch {
        res.status(502).json({ error: "Transcription service unavailable" });
    }
}
```

- [ ] **Step 2: Rewrite `transcribeAudio` in the hook**

Replace lines 1-21 of `src/hooks/useVoiceRecorder.ts`:
```ts
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";

async function transcribeAudio(blob: Blob, mimeType: string): Promise<string> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("Not signed in");

    const res = await fetch("/api/ai/transcribe", {
        method: "POST",
        headers: { "Content-Type": mimeType, Authorization: `Bearer ${token}` },
        body: blob,
    });

    if (!res.ok) throw new Error(`Transcribe ${res.status}`);
    const data = (await res.json()) as { text: string };
    return data.text.trim();
}
```

The rest of the hook (the `useVoiceRecorder` function itself) is untouched by this task — its mic-leak bug is fixed separately in Task 9.

- [ ] **Step 3: Verify**

`npx tsc -b --noEmit` clean. Manually with `npx vercel dev`: on the Chat page, hold the mic button, say something, release — confirm the transcript appears and gets sent. Check the Network tab: the request goes to `/api/ai/transcribe` with an `Authorization` header and the raw audio blob as the body, not to `api.groq.com`.

- [ ] **Step 4: Commit**

```bash
git add api/ai/transcribe.ts src/hooks/useVoiceRecorder.ts
git commit -m "feat: proxy audio transcription through an authenticated serverless endpoint"
```

---

### Task 8: Rewire `Chat.tsx` onto the proxy and delete the client-side Groq SDK usage

**Files:**
- Modify: `src/pages/dashboard/Chat.tsx:1-9,271-288`
- Delete: `src/lib/groq.ts`
- Modify: `package.json` (move `groq-sdk` usage — it's still needed, now only by `api/ai/complete.ts`; no dependency change needed since it's still imported somewhere in the repo)
- Modify: `README.md` (env var section, if it documents `VITE_GROQ_API_KEY`)

- [ ] **Step 1: Replace the Groq import and inline call in Chat.tsx**

Change the import at the top:
```tsx
import { aiChat, AiProxyError } from "@/lib/ai";
```
(remove `import { groq } from "@/lib/groq";`)

Replace the `groq.chat.completions.create` block (current lines ~271-288):
```tsx
            const reply = await aiChat(
                [{ role: "system", content: systemContent }, ...history, { role: "user", content: promptContent }],
                { maxTokens: 1024, temperature: 0.4 }
            ) || "I couldn't generate a response. Try again!";
            setMessages((prev) => [...prev, { id: genId(), sender: "genie", text: reply, time: getTime() }]);
        } catch (err) {
            const status = err instanceof AiProxyError ? err.status : undefined;
            const message = status === 429
                ? "You're sending messages a bit too fast — please wait a moment and try again."
                : "Sorry, I couldn't connect right now. Please try again in a moment.";
            setMessages((prev) => [...prev, { id: genId(), sender: "genie", text: message, time: getTime() }]);
        } finally {
            setIsTyping(false);
        }
```

This preserves the existing 429-specific message using the new `AiProxyError.status` (set in Task 6's rewrite of `ai.ts`) instead of the old `err?.status ?? err?.response?.status` duck-typing.

- [ ] **Step 2: Delete `src/lib/groq.ts`**

It's no longer imported anywhere once Step 1 lands — confirm with `grep -rn "lib/groq" src/` returning nothing, then delete the file.

- [ ] **Step 3: Update README's env var documentation**

In `README.md`, find any reference to `VITE_GROQ_API_KEY` and update it to describe `GROQ_API_KEY` + the three `FIREBASE_*` service-account vars as server-side/Vercel-only config (mirroring the `.env.example` comment from Task 5).

- [ ] **Step 4: Verify**

`npx tsc -b --noEmit`, `npx eslint .`, `npx vitest run` all clean. Manually with `npx vercel dev`: full chat conversation (send a message, get a reply, use reply/copy/delete actions — confirm those still work since this task didn't touch them), and confirm the browser's Network tab and page source contain no Groq API key anywhere (search devtools "Sources" for the string prefix `gsk_` — Groq's key prefix — it should not appear in any loaded JS bundle).

- [ ] **Step 5: Commit**

```bash
git add src/pages/dashboard/Chat.tsx README.md
git rm src/lib/groq.ts
git commit -m "feat: remove client-side Groq SDK usage from Chat — route through the AI proxy"
```

---

## Phase 3 — High priority bug fixes

### Task 9: Fix the voice recorder mic leak

**Files:**
- Modify: `src/hooks/useVoiceRecorder.ts`

**Problem:** `start()` has no unmount cleanup and no re-entrancy guard — an orphaned `getUserMedia` stream keeps the mic hardware active if the owning component unmounts mid-recording, or if `start()` fires twice before `recording` state commits.

- [ ] **Step 1: Add a stream ref, unmount cleanup, and a re-entrancy guard**

```ts
export function useVoiceRecorder(onTranscript: (text: string) => void) {
    const [recording, setRecording] = useState(false);
    const [transcribing, setTranscribing] = useState(false);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const startingRef = useRef(false);

    const start = useCallback(async () => {
        if (startingRef.current || recorderRef.current) return; // already starting/recording
        startingRef.current = true;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                stream.getTracks().forEach((t) => t.stop());
                recorderRef.current = null;
                const mimeType = recorder.mimeType || "audio/webm";
                const blob = new Blob(chunksRef.current, { type: mimeType });

                setTranscribing(true);
                try {
                    const text = await transcribeAudio(blob, mimeType);
                    if (text) onTranscript(text);
                    else toast.info("Didn't catch that — try again.");
                } catch {
                    toast.error("Transcription failed. Check your API key and try again.");
                } finally {
                    setTranscribing(false);
                }
            };

            recorderRef.current = recorder;
            recorder.start();
            setRecording(true);
        } catch {
            toast.error("Microphone access denied. Allow microphone in your browser settings.");
        } finally {
            startingRef.current = false;
        }
    }, [onTranscript]);

    const stop = useCallback(() => {
        recorderRef.current?.stop();
        setRecording(false);
    }, []);

    const toggle = useCallback(() => {
        if (recording) stop();
        else start();
    }, [recording, start, stop]);

    // Stop any live recording (and release the mic) if the owning component unmounts.
    useEffect(() => {
        return () => {
            recorderRef.current?.stop();
            recorderRef.current = null;
        };
    }, []);

    return { recording, transcribing, toggle, start, stop };
}
```

Add `useEffect` to the existing `react` import at the top of the file.

- [ ] **Step 2: Verify**

`npx tsc -b --noEmit` clean. Manually: on the Chat or Interview page, start recording, then navigate to a different dashboard page mid-recording (e.g. click a sidebar link) — confirm the browser's mic-in-use indicator (tab icon / OS indicator) turns off immediately instead of staying lit. Also rapid-double-click the mic button and confirm only one recording session starts (no console errors about calling `start()` on an already-recording `MediaRecorder`).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useVoiceRecorder.ts
git commit -m "fix: release the microphone on unmount and guard against double-start"
```

---

### Task 10: Stop stale voice transcripts from landing on the wrong interview question

**Files:**
- Modify: `src/pages/dashboard/Interview.tsx`

**Problem:** `submitAnswer` and `quitToSetup` never call `stopVoice()`. If a recording is in flight when the user submits/quits, the mic keeps running, and when transcription eventually finishes, `onTranscript` appends the old transcript onto whatever question is now active.

- [ ] **Step 1: Stop voice immediately on submit/quit, and guard the transcript callback against staleness**

Add a ref tracking the question the current recording belongs to, and check it in `onTranscript`:

```tsx
    // voice input — cross-browser via MediaRecorder + Groq Whisper
    const recordingQIndexRef = useRef<number | null>(null);
    const onTranscript = useCallback(
        (text: string) => {
            // Discard a transcript that arrives after the question it was recorded for
            // has already been submitted/changed (e.g. user hit Submit while transcribing).
            if (recordingQIndexRef.current !== qIndexRef.current) return;
            setAnswer((prev) => prev ? prev + " " + text : text);
        },
        []
    );
    const { recording: listening, transcribing, toggle: toggleVoiceRaw, start: startVoiceRaw, stop: stopVoice } = useVoiceRecorder(onTranscript);
    const startVoice = useCallback(() => {
        recordingQIndexRef.current = qIndexRef.current;
        startVoiceRaw();
    }, [startVoiceRaw]);
    const toggleVoice = useCallback(() => {
        if (listening) stopVoice();
        else startVoice();
    }, [listening, startVoice, stopVoice]);
```

Add a `qIndexRef` that mirrors `qIndex` (since `onTranscript` is a stable `useCallback` and can't read fresh `qIndex` state directly):

```tsx
    const [qIndex, setQIndex] = useState(0);
    const qIndexRef = useRef(qIndex);
    useEffect(() => { qIndexRef.current = qIndex; }, [qIndex]);
```
(place this right after the existing `const [qIndex, setQIndex] = useState(0);` line)

Then call `stopVoice()` at the top of both `submitAnswer` and `quitToSetup`:

```tsx
    const submitAnswer = async () => {
        if (!session || evaluating) return;
        stopVoice();
        setEvaluating(true);
        stopTimer();
        // ...unchanged...
```

```tsx
    const quitToSetup = () => {
        stopVoice();
        stopTimer();
        setSession(null);
        setView("setup");
    };
```

Since the component now defines its own `startVoice`/`toggleVoice` wrappers, find any JSX usages of the mic button further down in the file that currently call the hook's raw `startVoice`/`toggleVoice` (from the destructure) and confirm they still resolve to these new wrapped versions (same variable names, so no JSX changes needed — only the destructuring line and the two new wrapper functions above it change).

- [ ] **Step 2: Verify**

`npx tsc -b --noEmit` clean. Manually: start an interview, begin voice-recording an answer, and while `transcribing` (i.e. before the transcript resolves) click Submit. Confirm: (a) the mic stops immediately (browser mic indicator off), (b) once transcription finishes, the old transcript does NOT get appended to the new (now-current) question's answer box. Also test "Quit" mid-recording — mic should stop immediately.

- [ ] **Step 3: Commit**

```bash
git add src/pages/dashboard/Interview.tsx
git commit -m "fix: stop voice recording on submit/quit and discard stale transcripts"
```

---

### Task 11: Validate roadmap `resourceUrl` before rendering it as a link

**Files:**
- Modify: `src/lib/roadmap.ts:92-105`

**Problem:** `resourceUrl` comes straight from the LLM's JSON response and is later rendered as `<a href={task.resourceUrl}>`. An hallucinated or injected `javascript:`/`data:` URL would execute in the app's origin on click.

- [ ] **Step 1: Add a scheme allowlist when building tasks from the raw LLM response**

```ts
/** Only allow http(s) resource links — an LLM-hallucinated javascript:/data: URL must never reach an <a href>. */
function safeUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : undefined;
    } catch {
        return undefined;
    }
}
```

Add this function above `generateRoadmap`, then use it where tasks are built:

```ts
        tasks: (p.tasks || []).map((t) => ({
            id: uid8(),
            text: t.text || "",
            done: false,
            resourceLabel: t.resourceLabel,
            resourceUrl: safeUrl(t.resourceUrl),
        })),
```

`Roadmap.tsx:289` already guards with `{task.resourceUrl && (...)}`, so an `undefined` value from a rejected URL simply hides the resource link — no changes needed there.

- [ ] **Step 2: Write a unit test**

Add to `src/test/careerEngine.test.ts`... actually this belongs in a new `src/test/roadmap.test.ts` since `safeUrl` isn't exported/related to careerEngine. Since `safeUrl` is currently a private (non-exported) helper, export it for testability:

```ts
export function safeUrl(url: string | undefined): string | undefined { ... }
```

`src/test/roadmap.test.ts`:
```ts
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
```

- [ ] **Step 3: Run the test**

Run: `npx vitest run src/test/roadmap.test.ts`
Expected: all 6 cases PASS.

- [ ] **Step 4: Verify the full suite and typecheck**

`npx tsc -b --noEmit` and `npx vitest run` clean.

- [ ] **Step 5: Commit**

```bash
git add src/lib/roadmap.ts src/test/roadmap.test.ts
git commit -m "fix: reject non-http(s) resourceUrl values from AI-generated roadmaps"
```

---

### Task 12: Fix missing education detail field in Executive & Vibrant PDF templates

**Files:**
- Modify: `src/components/resume/pdf/Executive.tsx:49-60`
- Modify: `src/components/resume/pdf/Vibrant.tsx:76-86`

**Problem:** Both templates render `e.degree`, `e.school`, and dates in the Education section but omit `e.detail` (CGPA/honors), even though the form, live preview, and the other 4 PDF templates all include it.

- [ ] **Step 1: Add the missing line in Executive.tsx**

In the education block (around line 52-58), after the school `<Text>`:
```tsx
                    {d.education.filter((e) => e.school || e.degree).map((e) => (
                        <View key={e.id} style={{ marginBottom: 8 }}>
                            <Text style={[executive.sideText, { fontFamily: "Helvetica-Bold", color: "#ffffff" }]}>{e.degree}</Text>
                            <Text style={executive.sideText}>{e.school}</Text>
                            <Text style={[executive.sideText, { color: "#7fa3bf" }]}>{[e.start, e.end].filter(Boolean).join(" – ")}</Text>
                            {e.detail ? <Text style={[executive.sideText, { color: "#7fa3bf" }]}>{e.detail}</Text> : null}
                        </View>
                    ))}
```

- [ ] **Step 2: Add the missing line in Vibrant.tsx**

In the education block (around line 79-85), after the dates `<Text>`:
```tsx
                        {d.education.filter((e) => e.school || e.degree).map((e) => (
                            <View key={e.id} style={{ marginBottom: 8 }}>
                                <Text style={[vibrant.asideText, { fontFamily: "Helvetica-Bold" }]}>{e.degree}</Text>
                                <Text style={vibrant.asideText}>{e.school}</Text>
                                <Text style={[vibrant.asideText, { color: "#888888" }]}>{[e.start, e.end].filter(Boolean).join(" – ")}</Text>
                                {e.detail ? <Text style={vibrant.asideText}>{e.detail}</Text> : null}
                            </View>
                        ))}
```

- [ ] **Step 3: Verify**

`npx tsc -b --noEmit` clean. Manually: `npm run dev`, open Resume builder, fill in an education entry's "CGPA / Honors" (`detail`) field, switch template to "Executive" and download the PDF — confirm the detail line now appears in the sidebar Education section. Repeat for "Vibrant".

- [ ] **Step 4: Commit**

```bash
git add src/components/resume/pdf/Executive.tsx src/components/resume/pdf/Vibrant.tsx
git commit -m "fix: render education detail (CGPA/honors) in Executive and Vibrant PDF templates"
```

---

### Task 13: Fix the tech-stack "known skills" tokenizer

**Files:**
- Modify: `src/lib/careerStacks.ts:129-138`

**Problem:** `isKnown()` splits a stack item's core token only on `/ & ,`. A multi-word item like `"Node.js + Express"` becomes a single literal core string that will almost never appear verbatim in free-text user input, so it's permanently marked as a "gap" regardless of what the user actually knows.

- [ ] **Step 1: Write failing tests first**

Add to a new `src/test/careerStacks.test.ts`:
```ts
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
```

- [ ] **Step 2: Run tests to confirm they fail**

Run: `npx vitest run src/test/careerStacks.test.ts`
Expected: FAIL on the two `+`-joined-pair cases (they currently return `false`).

- [ ] **Step 3: Fix `isKnown` to check each core token in a '+'-joined phrase independently**

```ts
/** Heuristic: is this technology already known, given the user's skills text? */
export function isKnown(tech: string, skillsText: string): boolean {
    if (!skillsText) return false;
    const hay = skillsText.toLowerCase();
    // A stack item may bundle several technologies ("Node.js + Express",
    // "Python/FastAPI"). Split on separators including '+' and check each
    // core token independently — knowing any one of them counts as known.
    const withoutParens = tech.toLowerCase().replace(/\(.*?\)/g, "");
    const cores = withoutParens.split(/[/&,+]/).map((s) => s.trim()).filter((s) => s.length >= 2);
    return cores.some((core) => {
        const esc = core.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // Word-boundary match so "java" doesn't match inside "javascript".
        return new RegExp(`(^|[^a-z])${esc}([^a-z]|$)`, "i").test(hay);
    });
}
```

- [ ] **Step 4: Run tests to confirm they pass**

Run: `npx vitest run src/test/careerStacks.test.ts`
Expected: all 6 cases PASS.

- [ ] **Step 5: Verify the full suite**

`npx tsc -b --noEmit` and `npx vitest run` clean. Manually: Assessment → rate "Node.js" or "Express" as a known skill → Roadmap → generate a roadmap for "Backend Developer" → confirm the Tech Stack panel now shows "Node.js + Express" (or similar combined items) as known rather than a permanent gap.

- [ ] **Step 6: Commit**

```bash
git add src/lib/careerStacks.ts src/test/careerStacks.test.ts
git commit -m "fix: isKnown() now matches either half of a '+'-joined tech stack item"
```

---

## Phase 4 — Medium priority

### Task 14: Fix stale confidence when ML predictions are filtered for unknown labels

**Files:**
- Modify: `src/lib/careerEngine.ts:151-168`

**Problem:** When the ML API returns a label unknown to the frontend catalog, it's filtered out of `predictions`, but if `data.confidence` was provided by the server it's used as-is — reflecting the pre-filter margin, not the true margin between the (possibly different) top-1/top-2 after filtering.

- [ ] **Step 1: Recompute confidence from the filtered list whenever filtering actually dropped something**

```ts
                    const predictions = rawPredictions.filter((p) => {
                        if (knownLabels.has(p.career)) return true;
                        console.warn(`CareerGenie: ML API returned unknown career "${p.career}" — dropping it.`);
                        return false;
                    });
                    const wasFiltered = predictions.length !== rawPredictions.length;
                    if (predictions.length) {
                        const confidence =
                            typeof data.confidence === "number" && !wasFiltered
                                ? data.confidence
                                : predictions[0].probability - (predictions[1]?.probability ?? 0);
```

The rest of the block (`topCareer`, `uncertain`, `algorithm`, return statement) is unchanged — `uncertain`'s existing fallback (`confidence < UNCERTAIN_MARGIN`) already uses this now-corrected `confidence` value.

- [ ] **Step 2: Verify**

`npx tsc -b --noEmit` and `npx vitest run` clean (existing `careerEngine.test.ts` cases must still pass — check none of them assert the old stale-confidence behavior; if one does, it was testing the bug and should be updated to assert the corrected value instead).

- [ ] **Step 3: Commit**

```bash
git add src/lib/careerEngine.ts
git commit -m "fix: recompute prediction confidence after filtering unknown ML labels"
```

---

### Task 15: Fix Assessment.tsx's `touchedSkills` seeding

**Files:**
- Modify: `src/pages/dashboard/Assessment.tsx:38-39`

**Problem:** `touchedSkills` is seeded to "every current skill" whenever any prior assessment exists, regardless of whether that assessment's `skillRatings` actually covers every skill in the current `SKILLS` list. If the skill schema ever grows, a returning user can submit without rating new skills — they silently default to 0.

- [ ] **Step 1: Seed from the skills actually present in the saved assessment**

```tsx
    // Tracks which skills the user has actually rated — a prior assessment's saved
    // ratings count as touched (only the ones actually present, in case the skill
    // schema has grown since that assessment was saved), but the all-zero default
    // from emptySkillRatings() must not.
    const [touchedSkills, setTouchedSkills] = useState<Set<SkillKey>>(() => {
        const saved = loadAssessment()?.skillRatings;
        if (!saved) return new Set();
        return new Set(SKILLS.filter((s) => s in saved));
    });
```

- [ ] **Step 2: Verify**

`npx tsc -b --noEmit` clean. Manually: complete an assessment, then (in devtools) simulate a schema change by adding a fake extra key to `SKILLS` temporarily is impractical — instead, just confirm normal behavior is unaffected: reload the Assessment page after a completed assessment and confirm `skillsDone` is still `true` immediately (all real skills present in the saved data are still recognized as touched).

- [ ] **Step 3: Commit**

```bash
git add src/pages/dashboard/Assessment.tsx
git commit -m "fix: only count previously-saved skills as touched, not the full current skill list"
```

---

### Task 16: Guard the instructor "New task" button against overwriting a completed day

**Files:**
- Modify: `src/pages/dashboard/instructor/DailyTaskTab.tsx:123-127`

**Problem:** The button is always enabled, even when today's task is already done. Clicking it calls `generate()`, silently overwriting today's completed entry (and streak) with a fresh undone one.

- [ ] **Step 1: Disable it once today's task is done, and require confirmation to regenerate**

```tsx
                <div className="flex flex-wrap gap-2 mt-4">
                    <button
                        onClick={() => {
                            if (today?.done && !window.confirm("You've already completed today's task. Generate a new one anyway? This will reset today's progress.")) {
                                return;
                            }
                            generate();
                        }}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border/60 hover:bg-secondary/50 transition disabled:opacity-50"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> New task
                    </button>
                </div>
```

(Confirm the variable holding today's task in this component's scope — it's referenced as `today` earlier in the same block per the audit; use whatever the actual in-scope variable name is if it differs.)

- [ ] **Step 2: Verify**

`npx tsc -b --noEmit` clean. Manually: complete today's instructor task, click "New task" — confirm a confirmation dialog appears; cancel it and confirm the completed state/streak is untouched; click again and confirm, and confirm it does regenerate (this is an intentional escape hatch, not a hard block).

- [ ] **Step 3: Commit**

```bash
git add src/pages/dashboard/instructor/DailyTaskTab.tsx
git commit -m "fix: confirm before regenerating an already-completed daily task"
```

---

### Task 17: Wire up the "Remember me" checkbox on Login

**Files:**
- Modify: `src/pages/Login.tsx`
- Modify: `src/contexts/AuthContext.tsx` (`login` signature)

**Problem:** The checkbox has no state or handler — it's decorative, implying a persistence choice that doesn't exist (Firebase Auth always uses `browserLocalPersistence`, set once in `firebase.ts`).

- [ ] **Step 1: Make `login` accept a `remember` flag and switch persistence accordingly**

In `src/contexts/AuthContext.tsx`, update the import and `login` function:
```tsx
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
} from "firebase/auth";
```
```tsx
interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    signup: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string, remember?: boolean) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}
```
```tsx
    const login = async (email: string, password: string, remember = true) => {
        await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (!cred.user.emailVerified) {
            await signOut(auth);
            throw new Error("Please verify your email before logging in. Check your inbox.");
        }
    };
```

- [ ] **Step 2: Wire the checkbox to state and pass it through in Login.tsx**

Find the existing `login(email, password)` call in `Login.tsx`'s submit handler and the checkbox JSX (around line 138). Add state:
```tsx
    const [rememberMe, setRememberMe] = useState(true);
```
Update the checkbox:
```tsx
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded-sm"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
```
Update the submit call site to `await login(email, password, rememberMe);`.

- [ ] **Step 3: Verify**

`npx tsc -b --noEmit` clean. Manually: log in with "Remember me" unchecked, close the browser tab entirely and reopen the app — confirm you're signed out. Log in again with it checked, close and reopen — confirm you're still signed in.

- [ ] **Step 4: Commit**

```bash
git add src/contexts/AuthContext.tsx src/pages/Login.tsx
git commit -m "feat: wire up 'Remember me' to actually control session persistence"
```

---

### Task 18: Fix the chat reply-jump for a deleted message

**Files:**
- Modify: `src/pages/dashboard/Chat.tsx`

**Problem:** Tapping a reply-quote whose original message has since been deleted calls `scrollToMessage`, which silently no-ops (`if (!el) return;`) since the message no longer renders.

- [ ] **Step 1: Give the user feedback instead of silently doing nothing**

```tsx
    const scrollToMessage = (id: string) => {
        const el = messageElsRef.current.get(id);
        if (!el) {
            toast.info("That message was deleted.");
            return;
        }
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedId(id);
        window.setTimeout(() => setHighlightedId((cur) => (cur === id ? null : cur)), 1500);
    };
```

- [ ] **Step 2: Verify**

`npx tsc -b --noEmit` clean. Manually: send a message, reply to it from another message, delete the original, then tap the reply-quote on the reply — confirm a toast now appears instead of nothing happening.

- [ ] **Step 3: Commit**

```bash
git add src/pages/dashboard/Chat.tsx
git commit -m "fix: show feedback when jumping to a reply whose original message was deleted"
```

---

## Phase 5 — Low priority: dead code, duplication, polish

### Task 19: Remove the no-op string replace in instructor.ts

**Files:**
- Modify: `src/lib/instructor.ts:57`

- [ ] **Step 1: Delete the no-op line and use `career` directly**

```ts
export function personaFor(career: string | null): Persona {
    if (!career) {
        return {
            name: "Imran Aziz",
            title: "Senior Career Mentor",
            tagline: "10+ years guiding students into tech careers.",
        };
    }
    return {
        name: PERSONA_NAMES[career] || "Imran Aziz",
        title: `Senior ${career}`,
        tagline: `A senior ${career.toLowerCase()} mentoring you toward this exact career.`,
    };
}
```

- [ ] **Step 2: Verify**

`npx tsc -b --noEmit` and `npx vitest run` clean.

- [ ] **Step 3: Commit**

```bash
git add src/lib/instructor.ts
git commit -m "cleanup: remove no-op self-replace in personaFor"
```

---

### Task 20: Fix ErrorBoundary's dead export and unrendered error message

**Files:**
- Modify: `src/components/ErrorBoundary.tsx`

**Problem:** `export default ErrorBoundary` is unused (the app imports the named export). `state.message` is captured but never shown in the fallback UI.

- [ ] **Step 1: Remove the dead default export and render the captured message**

Remove line 57 (`export default ErrorBoundary;`).

Add the message to the fallback UI (after the description paragraph, before the buttons):
```tsx
                    <p className="text-muted-foreground mb-6">
                        An unexpected error interrupted this page. You can try again, or reload
                        the app.
                    </p>
                    {this.state.message && (
                        <p className="text-xs text-muted-foreground/70 mb-6 font-mono break-words">
                            {this.state.message}
                        </p>
                    )}
```

- [ ] **Step 2: Verify**

`npx tsc -b --noEmit` clean, confirm `grep -rn "ErrorBoundary" src/` shows only the named import in `App.tsx`. Manually: temporarily throw an error in a dashboard page component, confirm the fallback UI now shows the error message text.

- [ ] **Step 3: Commit**

```bash
git add src/components/ErrorBoundary.tsx
git commit -m "cleanup: remove unused default export, surface caught error message in fallback UI"
```

---

### Task 21: Remove unused icon imports and surface the prediction source indicator

**Files:**
- Modify: `src/pages/dashboard/Careers.tsx`

**Problem:** `Cpu`/`WifiOff` are imported but never used. Separately, `PredictionResult.source`/`.algorithm` (ML API vs. offline fallback) is computed in `careerEngine.ts` but never shown — users can't tell which they got.

- [ ] **Step 1: Use the icons to show the prediction source instead of removing them**

Near wherever the prediction/top career is first displayed in `Careers.tsx`, add a small badge (adjust placement to match the existing header layout around where `prediction.topCareer` is rendered):
```tsx
{prediction && (
    <span
        className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground"
        title={prediction.source === "ml-api" ? "Predicted by the ML model" : "Predicted by the offline fallback scorer"}
    >
        {prediction.source === "ml-api" ? <Cpu className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
        {prediction.source === "ml-api" ? "ML model" : "Offline mode"}
    </span>
)}
```

- [ ] **Step 2: Verify**

`npx tsc -b --noEmit` and `npx eslint .` clean. Manually: with `VITE_ML_API_URL` unset (offline fallback active), confirm the Careers page shows the "Offline mode" badge; if you have the FastAPI ML service running with `VITE_ML_API_URL` set, confirm it shows "ML model" instead.

- [ ] **Step 3: Commit**

```bash
git add src/pages/dashboard/Careers.tsx
git commit -m "feat: show whether a career prediction came from the ML model or the offline fallback"
```

---

### Task 22: Extract a shared streak-calculation helper

**Files:**
- Modify: `src/lib/userStore.ts` (add the shared helper)
- Modify: `src/lib/roadmap.ts:128-142` (`currentStreak` calls the shared helper)
- Modify: `src/lib/instructor.ts:316-328` (`taskStreak` calls the shared helper)

**Problem:** `currentStreak` (roadmap.ts) and `taskStreak` (instructor.ts) implement the identical consecutive-day-streak algorithm independently.

- [ ] **Step 1: Add the shared helper to userStore.ts, next to `todayKey`/`dayDiff`**

```ts
/** Longest run of consecutive days (ending today or yesterday) present in `dates`. 0 if the most recent date is more than 1 day old. */
export function streakFromDates(dates: string[]): number {
    if (dates.length === 0) return 0;
    const uniq = Array.from(new Set(dates)).sort().reverse(); // newest first
    if (dayDiff(todayKey(), uniq[0]) > 1) return 0;
    let streak = 1;
    for (let i = 0; i < uniq.length - 1; i++) {
        if (dayDiff(uniq[i], uniq[i + 1]) === 1) streak++;
        else break;
    }
    return streak;
}
```

- [ ] **Step 2: Write a unit test**

Add to a new `src/test/streak.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { streakFromDates, todayKey } from "@/lib/userStore";

describe("streakFromDates", () => {
    it("returns 0 for no dates", () => {
        expect(streakFromDates([])).toBe(0);
    });
    it("returns 1 for a single date today", () => {
        expect(streakFromDates([todayKey()])).toBe(1);
    });
    it("counts consecutive days ending today", () => {
        const d0 = new Date();
        const d1 = new Date(d0); d1.setDate(d0.getDate() - 1);
        const d2 = new Date(d0); d2.setDate(d0.getDate() - 2);
        const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        expect(streakFromDates([fmt(d2), fmt(d1), fmt(d0)])).toBe(3);
    });
    it("returns 0 if the most recent date is more than 1 day old", () => {
        const old = new Date();
        old.setDate(old.getDate() - 5);
        const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        expect(streakFromDates([fmt(old)])).toBe(0);
    });
});
```

- [ ] **Step 3: Run the test**

Run: `npx vitest run src/test/streak.test.ts`
Expected: all 4 cases PASS (this is straight extraction of already-working logic, not new behavior).

- [ ] **Step 4: Replace both call sites**

In `src/lib/roadmap.ts`, replace the body of `currentStreak`:
```ts
import { uid8, todayKey, dayDiff, streakFromDates } from "@/lib/userStore";
// ...
export const currentStreak = (dates: string[]): number => streakFromDates(dates);
```

In `src/lib/instructor.ts`, replace the body of `taskStreak`:
```ts
export const taskStreak = (tasks: DailyTask[]): number =>
    streakFromDates(tasks.filter((t) => t.done).map((t) => t.date));
```
(update the `userStore` import at the top of `instructor.ts` to include `streakFromDates`)

- [ ] **Step 5: Verify**

`npx tsc -b --noEmit` and `npx vitest run` clean (full suite, including the existing `careerEngine.test.ts`/`userStore.test.ts` and the new `streak.test.ts`).

- [ ] **Step 6: Commit**

```bash
git add src/lib/userStore.ts src/lib/roadmap.ts src/lib/instructor.ts src/test/streak.test.ts
git commit -m "refactor: extract shared streakFromDates helper, dedupe roadmap/instructor streak logic"
```

---

### Task 23: Unify resume PDF template link rendering

**Files:**
- Modify: `src/components/resume/pdf/Creative.tsx`
- Modify: `src/components/resume/pdf/Executive.tsx`
- Modify: `src/components/resume/pdf/Minimal.tsx`
- Modify: `src/components/resume/pdf/Vibrant.tsx`

**Problem:** `Classic.tsx` and `Modern.tsx` wrap `p.link` in a clickable `<Link>`; the other four render it as plain `<Text>`.

- [ ] **Step 1: Check how `Classic.tsx` or `Modern.tsx` imports/uses `Link`**

Read the exact import (from `@react-pdf/renderer`) and JSX pattern used there, e.g.:
```tsx
import { Page, View, Text, Link, StyleSheet } from "@react-pdf/renderer";
// ...
{p.link ? <Link src={p.link} style={someStyle}>{p.link}</Link> : null}
```

- [ ] **Step 2: Apply the same pattern to the other four templates**

In each of `Creative.tsx`, `Executive.tsx`, `Minimal.tsx`, `Vibrant.tsx`, add `Link` to the `@react-pdf/renderer` import and change the existing `{p.link ? <Text style={...}>{p.link}</Text> : null}` line to `{p.link ? <Link src={p.link} style={...}>{p.link}</Link> : null}` — reuse each file's existing style for that line (don't introduce a new style object; `Link` accepts the same `style` prop as `Text`).

- [ ] **Step 3: Verify**

`npx tsc -b --noEmit` clean. Manually: fill in a project with a link field, export the PDF in all 6 templates, confirm the link is clickable (opens the URL) in every one.

- [ ] **Step 4: Commit**

```bash
git add src/components/resume/pdf/Creative.tsx src/components/resume/pdf/Executive.tsx src/components/resume/pdf/Minimal.tsx src/components/resume/pdf/Vibrant.tsx
git commit -m "fix: render project links as clickable in all 6 resume PDF templates"
```

---

## Self-Review Notes

- **Spec coverage:** every Critical/High/Medium/Low item from the audit report maps to exactly one task above (Tasks 1-4 = Critical non-proxy, 5-8 = Critical Groq proxy, 9-13 = High, 14-18 = Medium, 19-23 = Low). The two audit items that were narrowly-scoped commentary rather than standalone bugs — the `careerCatalog.ts`/`careerStacks.ts` `ALIASES` compile-time-safety note, and the repo-wide `strict: false`/`strictNullChecks: false` tsconfig note — are intentionally *not* separate tasks; they're structural/tooling recommendations to raise with the user separately, not bugs with a concrete fix-in-place.
- **Placeholder scan:** no task contains "TBD"/"handle appropriately"/unstated code — every step shows exact code or an exact command.
- **Type consistency:** `aiChat`/`aiText`/`aiJson`/`AiProxyError` names and signatures introduced in Task 6 are used identically in Task 8 (Chat.tsx) and nowhere else needs them changed.
