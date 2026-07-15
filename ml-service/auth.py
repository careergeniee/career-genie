"""
auth.py
=======
Verifies Firebase ID tokens so /predict requires the same authenticated-user
guarantee the Vercel Groq proxy already enforces (api/_lib/auth.ts) instead of
being a fully open public endpoint.

Verification is done against Google's public JWKS for the Firebase Auth
token-signing key -- no service-account credential needed, matching the
lightweight approach already used elsewhere in this project (see
docs/superpowers/plans/2026-07-15-cloudflare-pages-functions-port.md, which
verified the same tokens the same way from a Cloudflare Worker).
"""

from __future__ import annotations
import os
import jwt
from jwt import PyJWKClient

JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"


class AuthError(Exception):
    """Raised when an Authorization header is missing, malformed, or the token fails verification."""


_jwk_client: PyJWKClient | None = None


def _get_jwk_client() -> PyJWKClient:
    global _jwk_client
    if _jwk_client is None:
        _jwk_client = PyJWKClient(JWKS_URL)
    return _jwk_client


def verify_id_token(token: str) -> str:
    """Verifies a Firebase ID token's signature, issuer, audience, and expiry. Returns the uid (sub claim)."""
    project_id = os.getenv("FIREBASE_PROJECT_ID")
    if not project_id:
        raise AuthError("FIREBASE_PROJECT_ID is not configured on the server")
    try:
        signing_key = _get_jwk_client().get_signing_key_from_jwt(token)
        decoded = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=project_id,
            issuer=f"https://securetoken.google.com/{project_id}",
        )
    except Exception as exc:  # jwt raises several distinct exception types -- all mean "reject"
        raise AuthError(f"Invalid or expired token: {exc}") from exc
    uid = decoded.get("sub") or decoded.get("user_id")
    if not uid:
        raise AuthError("Token missing subject claim")
    return uid


def require_user(authorization: str | None) -> str:
    """Extracts and verifies the Bearer token from an Authorization header. Raises AuthError if missing/invalid."""
    if not authorization or not authorization.startswith("Bearer "):
        raise AuthError("Missing Authorization header")
    return verify_id_token(authorization[len("Bearer "):])
