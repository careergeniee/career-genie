import { groq } from "@/lib/groq";

const MODEL = "llama-3.3-70b-versatile";
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

/** Plain text completion (with one retry and a timeout). */
export async function aiText(
    system: string,
    user: string,
    opts: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
    const call = () =>
        withTimeout(
            groq.chat.completions.create({
                model: MODEL,
                messages: [
                    { role: "system", content: system },
                    { role: "user", content: user },
                ],
                temperature: opts.temperature ?? 0.6,
                max_tokens: opts.maxTokens ?? 1500,
            }),
            AI_TIMEOUT_MS
        );
    try {
        const completion = await call();
        return completion.choices[0]?.message?.content?.trim() || "";
    } catch {
        try {
            const completion = await call(); // single retry on timeout/transient error
            return completion.choices[0]?.message?.content?.trim() || "";
        } catch {
            // Both attempts failed (e.g. persistent rate-limit or outage) — degrade to
            // an empty string rather than letting the retry itself throw uncaught.
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

    // Strip code fences if present.
    const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) text = fence[1].trim();

    // Otherwise grab from the first { or [ to its matching last } or ].
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
    const run = async (temperature: number) => {
        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: "system",
                    content:
                        system +
                        "\n\nRespond with ONLY valid JSON. No markdown, no commentary, no code fences.",
                },
                { role: "user", content: user },
            ],
            temperature,
            max_tokens: opts.maxTokens ?? 2500,
            response_format: { type: "json_object" },
        });
        return completion.choices[0]?.message?.content || "";
    };

    try {
        return extractJson<T>(await run(opts.temperature ?? 0.5));
    } catch {
        // Retry deterministically once before giving up.
        return extractJson<T>(await run(0));
    }
}
