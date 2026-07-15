import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

/** Central registry of all localStorage key names — avoids magic strings across files. */
export const KEYS = {
    chat: "chat",
    resume: "resume",
    resumeTemplate: "resume_tpl",
    resumeRole: "resume_role",
    roadmap: "roadmap",
    interviewSessions: "interview_sessions",
    instructorTasks: "instructorTasks",
    instructorChat: "instructorChat",
    instructorReminder: "instructorReminderTime",
    instructorLastNotified: "instructorLastNotified",
    assessment: "assessment",
    prediction: "prediction",
} as const;

/**
 * Anonymous per-browser id for signed-out visitors, so two different people on the
 * same shared/public machine never read or write the same "guest" data bucket.
 */
const ANON_ID_KEY = "cg:_anon_id";
let _anonId: string | null = null;
const anonId = () => {
    if (_anonId) return _anonId;
    try {
        const existing = localStorage.getItem(ANON_ID_KEY);
        if (existing) {
            _anonId = existing;
        } else {
            _anonId = `anon_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
            localStorage.setItem(ANON_ID_KEY, _anonId);
        }
    } catch {
        _anonId = "guest";
    }
    return _anonId;
};

const uid = () => auth.currentUser?.uid || anonId();

const fullKey = (key: string) => `cg:${uid()}:${key}`;

/** Warn once per session if localStorage is over 80% of the ~5MB limit. */
let _storageWarned = false;
const checkStorageQuota = () => {
    if (_storageWarned) return;
    try {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i) ?? "";
            total += k.length + (localStorage.getItem(k)?.length ?? 0);
        }
        if (total > 4_000_000) {
            _storageWarned = true;
            console.warn("CareerGenie: localStorage is nearly full. Consider clearing old data.");
        }
    } catch { /* noop */ }
};

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
        checkStorageQuota();
    } catch {
        console.warn("CareerGenie: localStorage write failed — storage may be full.");
    }
    // Async mirror to Firestore — fire-and-forget, localStorage is always the primary
    const userId = auth.currentUser?.uid;
    if (userId) {
        setDoc(doc(db, "users", userId), { [key]: JSON.stringify(value) }, { merge: true })
            .catch((err) => console.warn("CareerGenie: Firestore sync failed —", err));
    }
}

export function removeData(key: string): void {
    try {
        localStorage.removeItem(fullKey(key));
    } catch {
        /* noop */
    }
}

/**
 * Remove every locally-stored key belonging to the given uid (or the current
 * user/anonymous visitor if omitted). Call on logout so app data doesn't linger
 * readable in localStorage on shared/public machines.
 */
export function clearUserData(targetUid?: string): void {
    const prefix = `cg:${targetUid ?? uid()}:`;
    try {
        const toRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(prefix)) toRemove.push(k);
        }
        toRemove.forEach((k) => localStorage.removeItem(k));
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

/** Longest run of consecutive days (ending today or yesterday) present in `dates`. 0 if the most recent date is more than 1 day old. */
export function streakFromDates(dates: string[]): number {
    if (dates.length === 0) return 0;
    const uniq = Array.from(new Set(dates)).sort().reverse(); // newest first
    if (dayDiff(todayKey(), uniq[0]) > 1) return 0;
    let streak = 1;
    for (let i = 0; i < uniq.length - 1; i++) {
        if (dayDiff(uniq[i], uniq[i + 1]) === 1) streak++;
        else break;
    }
    return streak;
}
