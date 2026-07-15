import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";
import { requireUser } from "../_lib/auth.js";

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
