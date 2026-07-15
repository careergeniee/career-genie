import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

export class AuthError extends Error {}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function getJwks() {
    if (!jwks) jwks = createRemoteJWKSet(new URL(JWKS_URL));
    return jwks;
}

/** Verifies the caller's Firebase ID token from the Authorization header. Throws AuthError if missing/invalid. */
export async function requireUser(request: Request, projectId: string): Promise<string> {
    const header = request.headers.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) throw new AuthError("Missing Authorization header");

    let payload;
    try {
        ({ payload } = await jwtVerify(token, getJwks(), {
            issuer: `https://securetoken.google.com/${projectId}`,
            audience: projectId,
            algorithms: ["RS256"],
        }));
    } catch {
        throw new AuthError("Invalid or expired token");
    }

    if (!payload.sub) throw new AuthError("Invalid token: missing subject");
    return payload.sub;
}
