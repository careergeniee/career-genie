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
