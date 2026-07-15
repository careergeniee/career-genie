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
