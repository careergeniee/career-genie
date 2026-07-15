import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireUser } from "../_lib/auth.js";

export const config = { api: { bodyParser: false } };

const MAX_BYTES = 20 * 1024 * 1024; // Defense-in-depth cap for the request body; Vercel's own platform limit (~4.5MB on most plans) is smaller than this and will reject an oversized request first.

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
