import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc, deleteField } from "firebase/firestore";

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
    assessmentDraft: "assessmentDraft",
    prediction: "prediction",
} as const;

/**
 * Anonymous per-browser id for signed-out visitors, so two different people on the
 * same shared/public machine never read or write the same "guest" data bucket.
 * Deliberately local-only, never mirrored: it isn't account data, it's just a
 * namespace so pre-login usage doesn't collide with another visitor's.
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

// ---------------------------------------------------------------------------
// Envelope: every value saved after this change carries an updatedAt
// timestamp, so concurrent writes from two devices can be resolved by
// last-write-wins instead of whichever network request happens to land
// last. Data written before this change (and any hand-edited Firestore
// field) has no envelope — treated as the oldest possible write so real
// envelopes always take precedence, and loadData() still returns the bare
// value either way so no caller needs to know the difference.
// ---------------------------------------------------------------------------
interface Envelope<T> {
    __cg: true;
    value: T;
    updatedAt: number;
}
const isEnvelope = (x: unknown): x is Envelope<unknown> =>
    typeof x === "object" && x !== null && (x as { __cg?: unknown }).__cg === true;

const wrap = <T>(value: T, updatedAt: number): Envelope<T> => ({ __cg: true, value, updatedAt });

/** Extracts the updatedAt from a raw (already-parsed) stored value; -1 for pre-envelope/unrecognized data. */
const envelopeTimestamp = (raw: unknown): number => (isEnvelope(raw) ? raw.updatedAt : -1);

/**
 * Shared last-write-wins comparison, used by both flushPendingWrites() (a
 * queued write racing a possibly-newer remote value) and initUserData()'s
 * hydration (a possibly-newer local pending write racing a remote value) —
 * same decision either direction, so both call sites feed it their own
 * updatedAt/remote pair instead of re-deriving the comparison independently.
 */
const localWins = (localUpdatedAt: number, remoteRaw: unknown): boolean => {
    let remoteUpdatedAt = -1;
    if (typeof remoteRaw === "string") {
        try {
            remoteUpdatedAt = envelopeTimestamp(JSON.parse(remoteRaw));
        } catch { /* unparseable remote value — treat as oldest, local wins */ }
    }
    return localUpdatedAt >= remoteUpdatedAt;
};

export function loadData<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(fullKey(key));
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return (isEnvelope(parsed) ? parsed.value : parsed) as T;
    } catch {
        return fallback;
    }
}

// ---------------------------------------------------------------------------
// Pending-writes queue: saveData()'s Firestore mirror is fire-and-forget, so
// a write can fail silently (offline, transient Firestore error) leaving the
// cloud copy stale. Failed writes go in here, keyed by data key (only the
// latest value per key is kept — no need to replay history, just the most
// recent state), and get retried when connectivity looks like it's back.
// Deletes (removeData) can fail and queue the same way, distinguished by
// `deleted: true` instead of carrying a value.
// ---------------------------------------------------------------------------
type PendingEntry = { raw: string; updatedAt: number } | { deleted: true; updatedAt: number };
const pendingStorageKey = () => `cg:${uid()}:_pending`;

const getPending = (): Record<string, PendingEntry> => {
    try {
        return JSON.parse(localStorage.getItem(pendingStorageKey()) ?? "{}");
    } catch {
        return {};
    }
};

const SYNC_STATUS_EVENT = "cg:sync-status";

const setPending = (map: Record<string, PendingEntry>): void => {
    try {
        if (Object.keys(map).length === 0) localStorage.removeItem(pendingStorageKey());
        else localStorage.setItem(pendingStorageKey(), JSON.stringify(map));
    } catch { /* noop */ }
    try {
        window.dispatchEvent(new Event(SYNC_STATUS_EVENT));
    } catch { /* noop (non-browser test environment) */ }
};

/** Number of keys with a write that hasn't reached Firestore yet — drives the "sync failed" UI indicator. */
export function getPendingCount(): number {
    return Object.keys(getPending()).length;
}

/** Subscribe to pending-write-count changes. Returns an unsubscribe function. */
export function onSyncStatusChange(cb: () => void): () => void {
    window.addEventListener(SYNC_STATUS_EVENT, cb);
    return () => window.removeEventListener(SYNC_STATUS_EVENT, cb);
}

let _flushing = false;

/**
 * Push every queued write to Firestore, resolving conflicts by last-write-wins:
 * for each pending key, compares its updatedAt against whatever's currently in
 * Firestore (which another device may have written more recently) before
 * overwriting. A stale queued write loses to newer remote data — the remote
 * value is adopted locally instead of blindly pushing the stale one over it.
 */
export async function flushPendingWrites(): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId || _flushing) return;
    const pending = getPending();
    const keys = Object.keys(pending);
    if (keys.length === 0) return;

    _flushing = true;
    try {
        const snap = await getDoc(doc(db, "users", userId));
        const remote: Record<string, unknown> = snap.exists() ? snap.data() : {};
        const toWrite: Record<string, string> = {};
        const toDelete: string[] = [];

        for (const key of keys) {
            const entry = pending[key];
            const remoteRaw = remote[key];
            if (!localWins(entry.updatedAt, remoteRaw)) {
                // Remote is newer — another device already flushed a later write (or
                // delete). This device's queued entry is stale; adopt remote instead
                // of pushing over it.
                if (typeof remoteRaw === "string") localStorage.setItem(`cg:${userId}:${key}`, remoteRaw);
                else localStorage.removeItem(`cg:${userId}:${key}`);
                console.info(`CareerGenie: discarded stale queued ${"deleted" in entry ? "delete" : "write"} for "${key}" — a newer version was already synced`);
                continue;
            }
            if ("deleted" in entry) toDelete.push(key);
            else toWrite[key] = entry.raw;
        }

        if (Object.keys(toWrite).length > 0) {
            await setDoc(doc(db, "users", userId), toWrite, { merge: true });
        }
        if (toDelete.length > 0) {
            const deletePayload: Record<string, ReturnType<typeof deleteField>> = {};
            toDelete.forEach((k) => { deletePayload[k] = deleteField(); });
            await updateDoc(doc(db, "users", userId), deletePayload);
        }

        // Only clear the keys this flush actually resolved — a saveData()/removeData()
        // failure that queued a *different* key while the getDoc/setDoc above were in
        // flight must survive, not get wiped by a blind reset.
        const stillPending = getPending();
        keys.forEach((k) => delete stillPending[k]);
        setPending(stillPending);
        console.info(`CareerGenie: flushed ${keys.length} pending write(s)`);
    } catch (err) {
        console.warn("CareerGenie: pending-write flush failed, will retry later —", err);
    } finally {
        _flushing = false;
    }
}

let _retryTimer: ReturnType<typeof setTimeout> | null = null;
const scheduleRetry = (): void => {
    if (_retryTimer) return;
    _retryTimer = setTimeout(() => {
        _retryTimer = null;
        void flushPendingWrites();
    }, 15_000);
};

if (typeof window !== "undefined") {
    window.addEventListener("online", () => void flushPendingWrites());
}

export function saveData<T>(key: string, value: T): void {
    const updatedAt = Date.now();
    const envelope = wrap(value, updatedAt);
    const raw = JSON.stringify(envelope);
    try {
        localStorage.setItem(fullKey(key), raw);
        checkStorageQuota();
    } catch {
        console.warn("CareerGenie: localStorage write failed — storage may be full.");
    }

    const userId = auth.currentUser?.uid;
    if (!userId) return; // guests: local-only, nothing to mirror or queue

    // Two saves to the same key can resolve out of order (a slow older write's
    // .then/.catch firing after a faster newer one's). Only let this call's
    // outcome touch the pending queue if it's still the most recent local
    // write for `key` — otherwise an older save's late success could erase a
    // newer save's still-pending entry, or its late failure could re-queue
    // stale data over a newer save that already succeeded.
    const isCurrentWrite = () => {
        try {
            const current = JSON.parse(localStorage.getItem(fullKey(key)) ?? "null");
            return isEnvelope(current) && current.updatedAt === updatedAt;
        } catch {
            return false;
        }
    };

    setDoc(doc(db, "users", userId), { [key]: raw }, { merge: true })
        .then(() => {
            if (!isCurrentWrite()) return;
            const pending = getPending();
            if (pending[key]) {
                delete pending[key];
                setPending(pending);
            }
        })
        .catch((err) => {
            console.warn("CareerGenie: Firestore sync failed, queued for retry —", err);
            if (!isCurrentWrite()) return;
            const pending = getPending();
            pending[key] = { raw, updatedAt };
            setPending(pending);
            scheduleRetry();
        });
}

export function removeData(key: string): void {
    try {
        localStorage.removeItem(fullKey(key));
    } catch {
        /* noop */
    }
    const updatedAt = Date.now();
    const pending = getPending();
    if (pending[key]) {
        delete pending[key];
        setPending(pending);
    }
    // Mirror the deletion to Firestore — without this, a cleared key just
    // resurrects on the next login/device from the still-present remote copy.
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    updateDoc(doc(db, "users", userId), { [key]: deleteField() })
        .catch((err) => {
            console.warn("CareerGenie: Firestore delete failed, queued for retry —", err);
            // If a newer save already re-created this key locally, this delete is
            // stale — don't queue it over data the user has since written back.
            if (localStorage.getItem(fullKey(key))) return;
            const p = getPending();
            p[key] = { deleted: true, updatedAt };
            setPending(p);
            scheduleRetry();
        });
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Pull all user data from Firestore and hydrate localStorage. Called on login.
 * Retries a few times with backoff: right after sign-in, Firestore's SDK may
 * not have finished establishing its connection yet and getDoc() can reject
 * with "client is offline" even though the network and rules are both fine —
 * a single failed attempt here shouldn't permanently strand the user without
 * their data for the rest of the session (the caller marks hydration "done"
 * for this uid regardless of outcome, so there's no retry above this layer).
 *
 * Conflict-aware: a key with an unsynced local write (still in the pending
 * queue) is never downgraded by an older remote value — that write gets
 * flushed instead once hydration confirms Firestore is reachable.
 */
export async function initUserData(): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const MAX_ATTEMPTS = 3;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            const snap = await getDoc(doc(db, "users", userId));
            if (snap.exists()) {
                const remote = snap.data();
                const pending = getPending();
                const keys = Object.keys(remote);
                let applied = 0;
                Object.entries(remote).forEach(([key, val]) => {
                    const pendingEntry = pending[key];
                    if (pendingEntry && localWins(pendingEntry.updatedAt, val)) return; // keep the newer local value (or pending delete)
                    localStorage.setItem(`cg:${userId}:${key}`, val as string);
                    applied++;
                });
                console.info(`CareerGenie: hydrated ${applied} field(s) from Firestore (${keys.length - applied} skipped for newer local data)`);
            } else {
                console.info("CareerGenie: no Firestore document found for this user yet");
            }
            if (getPendingCount() > 0) void flushPendingWrites();
            return;
        } catch (err) {
            if (attempt === MAX_ATTEMPTS) {
                // Firestore unavailable or rules not configured — localStorage still works,
                // but logging this is the only way to tell "no remote data yet" apart from
                // "every sync is silently being rejected" (e.g. undeployed security rules).
                console.warn(`CareerGenie: Firestore hydration failed after ${MAX_ATTEMPTS} attempts —`, err);
                return;
            }
            console.warn(`CareerGenie: Firestore hydration attempt ${attempt} failed, retrying —`, err);
            await sleep(attempt * 800);
        }
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
