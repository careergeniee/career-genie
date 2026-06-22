import { auth } from "@/lib/firebase";

/**
 * Tiny user-scoped persistence layer built on localStorage.
 * Keys are namespaced by the signed-in user's uid so two accounts on the
 * same browser never see each other's resumes, interview sessions, or roadmaps.
 *
 * We use localStorage (same approach as the AI Chatbot) so the modules work
 * out of the box without needing Firestore security rules configured.
 */

const uid = () => auth.currentUser?.uid || "guest";

const fullKey = (key: string) => `cg:${uid()}:${key}`;

export function loadData<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(fullKey(key));
        if (!raw) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

export function saveData<T>(key: string, value: T): void {
    try {
        localStorage.setItem(fullKey(key), JSON.stringify(value));
    } catch {
        /* storage full / unavailable — fail silently */
    }
}

export function removeData(key: string): void {
    try {
        localStorage.removeItem(fullKey(key));
    } catch {
        /* noop */
    }
}

/** Stable unique id for list items (jobs, tasks, sessions...). */
export const uid8 = () => Math.random().toString(36).slice(2, 10);

/** Today as YYYY-MM-DD in local time — used for streak tracking. */
export const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;
};

/** Difference in whole days between two YYYY-MM-DD keys (a - b). */
export const dayDiff = (a: string, b: string) => {
    const da = new Date(a + "T00:00:00");
    const db = new Date(b + "T00:00:00");
    return Math.round((da.getTime() - db.getTime()) / 86_400_000);
};
