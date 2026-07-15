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
