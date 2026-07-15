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
