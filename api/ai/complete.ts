import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";
import { requireUser } from "../_lib/auth.js";
import { applyCors } from "../_lib/cors.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

// requireUser() only verifies *identity*, not rate or size -- without these,
// any valid (or leaked/phished) token can be replayed with a huge maxTokens
// and/or a huge prompt to drive Groq spend arbitrarily high. The highest
// real caller (src/lib/roadmap.ts) asks for 3000, so 4096 leaves headroom
// without leaving the value effectively unbounded.
const MAX_TOKENS_CAP = 4096;
const MAX_TOTAL_CONTENT_CHARS = 20000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (applyCors(req, res)) return;
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
    const totalContentChars = messages.reduce(
        (sum: number, m: { content?: unknown }) =>
            sum + (typeof m?.content === "string" ? m.content.length : 0),
        0
    );
    if (totalContentChars > MAX_TOTAL_CONTENT_CHARS) {
        res.status(413).json({ error: "messages too large" });
        return;
    }

    try {
        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages,
            temperature: typeof temperature === "number" ? temperature : 0.6,
            max_tokens:
                typeof maxTokens === "number" && maxTokens > 0
                    ? Math.min(maxTokens, MAX_TOKENS_CAP)
                    : 1500,
            ...(jsonMode ? { response_format: { type: "json_object" as const } } : {}),
        });
        const content = completion.choices[0]?.message?.content || "";
        res.status(200).json({ content });
    } catch (err) {
        const status = (err as { status?: number })?.status ?? 500;
        res.status(status).json({ error: "AI request failed" });
    }
}
