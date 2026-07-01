/** Basic client-side email shape check — Firebase still validates server-side regardless. */
export const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/** Maps common Firebase Auth error codes to human-readable messages instead of
 *  surfacing raw strings like "Firebase: Error (auth/wrong-password)." to users. */
export function getAuthErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
    const code = (err as { code?: string })?.code;
    switch (code) {
        case "auth/invalid-email":
            return "That email address doesn't look right.";
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Incorrect email or password.";
        case "auth/user-disabled":
            return "This account has been disabled. Contact support if that seems wrong.";
        case "auth/too-many-requests":
            return "Too many attempts — please wait a moment and try again.";
        case "auth/email-already-in-use":
            return "This email is already registered. Try logging in instead.";
        case "auth/weak-password":
            return "Password is too weak — please use at least 6 characters.";
        case "auth/network-request-failed":
            return "Network error — check your connection and try again.";
        case "auth/popup-closed-by-user":
            return "Sign-in was cancelled.";
        default:
            return fallback;
    }
}
