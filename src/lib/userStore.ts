import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
    // Async mirror to Firestore — fire-and-forget, localStorage is always the primary
    const userId = auth.currentUser?.uid;
    if (userId) {
        setDoc(doc(db, "users", userId), { [key]: JSON.stringify(value) }, { merge: true })
            .catch(() => {});
    }
}

export function removeData(key: string): void {
    try {
        localStorage.removeItem(fullKey(key));
    } catch {
        /* noop */
    }
}

/** Pull all user data from Firestore and hydrate localStorage. Called on login. */
export async function initUserData(): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    try {
        const snap = await getDoc(doc(db, "users", userId));
        if (snap.exists()) {
            const remote = snap.data();
            Object.entries(remote).forEach(([key, val]) => {
                localStorage.setItem(`cg:${userId}:${key}`, val as string);
            });
        }
    } catch {
        // Firestore unavailable or rules not configured — localStorage still works
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
