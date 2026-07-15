import type { VercelRequest, VercelResponse } from "@vercel/node";

// The Cloudflare Pages deployment can't call Groq directly (Groq's own bot
// protection blocks Cloudflare Workers' IP ranges), so its frontend calls this
// Vercel-hosted API cross-origin instead — these are the only origins allowed to.
const ALLOWED_ORIGINS = new Set(["https://career-genie.pages.dev"]);

/**
 * Sets CORS headers for allowed cross-origin callers. Returns true if this was
 * a preflight OPTIONS request that's now fully handled — callers should return
 * immediately without further processing.
 */
export function applyCors(req: VercelRequest, res: VercelResponse): boolean {
    const origin = req.headers.origin;
    if (typeof origin === "string" && ALLOWED_ORIGINS.has(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Vary", "Origin");
    }
    if (req.method === "OPTIONS") {
        res.status(204).end();
        return true;
    }
    return false;
}
