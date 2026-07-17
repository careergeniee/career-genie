import { describe, it, expect, beforeEach, vi } from "vitest";

// userStore.ts pulls in Firebase (auth/db) purely to mirror writes — stub both
// so tests never touch real network/Firebase SDK internals.
const currentUserRef: { current: { uid: string } | null } = { current: null };
vi.mock("@/lib/firebase", () => ({
    auth: {
        get currentUser() {
            return currentUserRef.current;
        },
    },
    db: {},
}));
const { updateDocMock, getDocMock, setDocMock } = vi.hoisted(() => ({
    updateDocMock: vi.fn().mockResolvedValue(undefined),
    getDocMock: vi.fn().mockResolvedValue({ exists: () => false, data: () => ({}) }),
    setDocMock: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("firebase/firestore", () => ({
    doc: vi.fn(),
    setDoc: setDocMock,
    getDoc: getDocMock,
    updateDoc: updateDocMock,
    deleteField: vi.fn(() => "DELETE_FIELD_SENTINEL"),
}));

import {
    loadData, saveData, removeData, clearUserData, initUserData,
    flushPendingWrites, getPendingCount, onSyncStatusChange,
    KEYS, todayKey, dayDiff,
} from "@/lib/userStore";

// Flushes the microtask queue so saveData()'s unawaited setDoc(...).then/.catch
// handlers (which run the pending-queue bookkeeping this file asserts on) settle
// before an assertion runs.
const flushMicrotasks = () => new Promise((r) => setTimeout(r, 0));

describe("userStore", () => {
    beforeEach(() => {
        localStorage.clear();
        currentUserRef.current = null;
        updateDocMock.mockClear();
        getDocMock.mockClear();
        getDocMock.mockResolvedValue({ exists: () => false, data: () => ({}) });
        setDocMock.mockClear();
        setDocMock.mockResolvedValue(undefined);
    });

    it("round-trips data through loadData/saveData", () => {
        currentUserRef.current = { uid: "user-a" };
        saveData(KEYS.resume, { name: "Taha" });
        expect(loadData(KEYS.resume, null)).toEqual({ name: "Taha" });
    });

    it("returns the fallback when no data has been saved", () => {
        currentUserRef.current = { uid: "user-a" };
        expect(loadData("nonexistent", "default")).toBe("default");
    });

    it("returns the fallback instead of throwing on corrupted JSON", () => {
        currentUserRef.current = { uid: "user-a" };
        localStorage.setItem("cg:user-a:resume", "{not valid json");
        expect(loadData(KEYS.resume, { safe: true })).toEqual({ safe: true });
    });

    it("scopes keys per authenticated user — two accounts never see each other's data", () => {
        currentUserRef.current = { uid: "user-a" };
        saveData(KEYS.roadmap, "A's roadmap");

        currentUserRef.current = { uid: "user-b" };
        expect(loadData(KEYS.roadmap, null)).toBeNull();
        saveData(KEYS.roadmap, "B's roadmap");

        currentUserRef.current = { uid: "user-a" };
        expect(loadData(KEYS.roadmap, null)).toBe("A's roadmap");

        currentUserRef.current = { uid: "user-b" };
        expect(loadData(KEYS.roadmap, null)).toBe("B's roadmap");
    });

    it("removeData deletes only the targeted key", () => {
        currentUserRef.current = { uid: "user-a" };
        saveData(KEYS.chat, ["hello"]);
        saveData(KEYS.resume, { name: "Taha" });
        removeData(KEYS.chat);
        expect(loadData(KEYS.chat, null)).toBeNull();
        expect(loadData(KEYS.resume, null)).toEqual({ name: "Taha" });
    });

    it("removeData also deletes the field from Firestore for a signed-in user, so a cleared key can't resurrect on the next login", () => {
        currentUserRef.current = { uid: "user-a" };
        removeData(KEYS.chat);
        expect(updateDocMock).toHaveBeenCalledTimes(1);
        expect(updateDocMock).toHaveBeenCalledWith(undefined, { [KEYS.chat]: "DELETE_FIELD_SENTINEL" });
    });

    it("removeData does not touch Firestore for an anonymous visitor", () => {
        currentUserRef.current = null;
        removeData(KEYS.chat);
        expect(updateDocMock).not.toHaveBeenCalled();
    });

    it("gives every unauthenticated visitor the same stable per-browser anonymous id", () => {
        currentUserRef.current = null;
        saveData(KEYS.assessment, { step: 1 });
        const keys = Object.keys(localStorage).filter((k) => k.startsWith("cg:anon_"));
        expect(keys.length).toBe(1);
        // A second write from the same "browser" (same localStorage) reuses the same anon id.
        saveData(KEYS.prediction, { topCareer: "x" });
        const keysAfter = Object.keys(localStorage).filter((k) => k.startsWith("cg:anon_"));
        expect(keysAfter.length).toBe(2);
        expect(keysAfter.every((k) => k.startsWith(keys[0].split(":").slice(0, 2).join(":")))).toBe(true);
    });

    it("clearUserData removes only that user's keys, leaving others untouched", () => {
        currentUserRef.current = { uid: "user-a" };
        saveData(KEYS.resume, { name: "A" });
        currentUserRef.current = { uid: "user-b" };
        saveData(KEYS.resume, { name: "B" });

        clearUserData("user-a");

        currentUserRef.current = { uid: "user-a" };
        expect(loadData(KEYS.resume, null)).toBeNull();
        currentUserRef.current = { uid: "user-b" };
        expect(loadData(KEYS.resume, null)).toEqual({ name: "B" });
    });

    it("loadData reads pre-envelope (legacy) data written before the updatedAt envelope existed", () => {
        currentUserRef.current = { uid: "user-a" };
        localStorage.setItem("cg:user-a:resume", JSON.stringify({ name: "Legacy" }));
        expect(loadData(KEYS.resume, null)).toEqual({ name: "Legacy" });
    });

    it("a failed Firestore write is queued for retry and getPendingCount() reflects it", async () => {
        currentUserRef.current = { uid: "user-a" };
        setDocMock.mockRejectedValueOnce(new Error("offline"));
        saveData(KEYS.resume, { name: "Taha" });
        await flushMicrotasks();
        expect(getPendingCount()).toBe(1);
    });

    it("a successful write is not queued, and clears any earlier queued entry for the same key", async () => {
        currentUserRef.current = { uid: "user-a" };
        setDocMock.mockRejectedValueOnce(new Error("offline"));
        saveData(KEYS.resume, { name: "v1" });
        await flushMicrotasks();
        expect(getPendingCount()).toBe(1);

        setDocMock.mockResolvedValueOnce(undefined);
        saveData(KEYS.resume, { name: "v2" });
        await flushMicrotasks();
        expect(getPendingCount()).toBe(0);
    });

    it("onSyncStatusChange notifies subscribers when the pending queue changes", async () => {
        currentUserRef.current = { uid: "user-a" };
        const cb = vi.fn();
        const unsubscribe = onSyncStatusChange(cb);

        setDocMock.mockRejectedValueOnce(new Error("offline"));
        saveData(KEYS.chat, ["hi"]);
        await flushMicrotasks();

        expect(cb).toHaveBeenCalled();
        unsubscribe();
    });

    it("flushPendingWrites pushes a queued write to Firestore once reconnected", async () => {
        currentUserRef.current = { uid: "user-a" };
        setDocMock.mockRejectedValueOnce(new Error("offline"));
        saveData(KEYS.roadmap, { step: 1 });
        await flushMicrotasks();
        expect(getPendingCount()).toBe(1);

        setDocMock.mockClear();
        setDocMock.mockResolvedValue(undefined);
        getDocMock.mockResolvedValueOnce({ exists: () => false, data: () => ({}) });

        await flushPendingWrites();

        expect(setDocMock).toHaveBeenCalledTimes(1);
        expect(getPendingCount()).toBe(0);
    });

    it("flushPendingWrites discards a stale queued write when Firestore already has a newer version (last-write-wins)", async () => {
        currentUserRef.current = { uid: "user-a" };

        // Simulate an offline edit made on this device.
        setDocMock.mockRejectedValueOnce(new Error("offline"));
        saveData(KEYS.roadmap, { step: "old" });
        await flushMicrotasks();
        expect(getPendingCount()).toBe(1);

        // Meanwhile, another device already flushed a newer write straight to Firestore.
        const newerRemote = JSON.stringify({
            __cg: true, value: { step: "new-from-other-device" }, updatedAt: Date.now() + 100_000,
        });
        getDocMock.mockResolvedValueOnce({ exists: () => true, data: () => ({ [KEYS.roadmap]: newerRemote }) });
        setDocMock.mockClear();

        await flushPendingWrites();

        // The stale queued write must never be pushed over the newer remote value...
        expect(setDocMock).not.toHaveBeenCalled();
        // ...the conflict is resolved either way (nothing left dangling in the queue)...
        expect(getPendingCount()).toBe(0);
        // ...and this device adopts the newer remote value instead of keeping its stale one.
        expect(loadData(KEYS.roadmap, null)).toEqual({ step: "new-from-other-device" });
    });

    it("a failed Firestore delete is queued for retry and applied once flushed", async () => {
        currentUserRef.current = { uid: "user-a" };
        saveData(KEYS.chat, ["hello"]);
        await flushMicrotasks();

        updateDocMock.mockRejectedValueOnce(new Error("offline"));
        removeData(KEYS.chat);
        await flushMicrotasks();
        expect(getPendingCount()).toBe(1);

        updateDocMock.mockClear();
        updateDocMock.mockResolvedValue(undefined);
        getDocMock.mockResolvedValueOnce({ exists: () => false, data: () => ({}) });

        await flushPendingWrites();

        expect(updateDocMock).toHaveBeenCalledWith(undefined, { [KEYS.chat]: "DELETE_FIELD_SENTINEL" });
        expect(getPendingCount()).toBe(0);
    });

    it("an older save's late failure does not re-queue stale data over a newer save that already succeeded", async () => {
        currentUserRef.current = { uid: "user-a" };
        const nowSpy = vi.spyOn(Date, "now");
        try {
            nowSpy.mockReturnValueOnce(1000); // v1 — older
            let rejectV1: (err: Error) => void = () => {};
            setDocMock.mockReturnValueOnce(new Promise((_, reject) => { rejectV1 = reject; }));
            saveData(KEYS.resume, { name: "v1" });

            nowSpy.mockReturnValueOnce(2000); // v2 — newer, succeeds immediately
            setDocMock.mockResolvedValueOnce(undefined);
            saveData(KEYS.resume, { name: "v2" });
            await flushMicrotasks();
            expect(getPendingCount()).toBe(0);

            // v1's setDoc call finally fails, arriving after v2 already synced.
            rejectV1(new Error("offline"));
            await flushMicrotasks();

            expect(getPendingCount()).toBe(0);
            expect(loadData(KEYS.resume, null)).toEqual({ name: "v2" });
        } finally {
            nowSpy.mockRestore();
        }
    });

    it("an older save's late success does not erase a newer save's still-pending queue entry", async () => {
        currentUserRef.current = { uid: "user-a" };
        const nowSpy = vi.spyOn(Date, "now");
        try {
            nowSpy.mockReturnValueOnce(1000); // v1 — older, resolves late
            let resolveV1: () => void = () => {};
            setDocMock.mockReturnValueOnce(new Promise<void>((resolve) => { resolveV1 = resolve; }));
            saveData(KEYS.resume, { name: "v1" });

            nowSpy.mockReturnValueOnce(2000); // v2 — newer, fails immediately
            setDocMock.mockRejectedValueOnce(new Error("offline"));
            saveData(KEYS.resume, { name: "v2" });
            await flushMicrotasks();
            expect(getPendingCount()).toBe(1);

            resolveV1();
            await flushMicrotasks();

            // v1's late success must not clear v2's still-pending entry.
            expect(getPendingCount()).toBe(1);
        } finally {
            nowSpy.mockRestore();
        }
    });

    it("flushPendingWrites does not drop a pending entry added for a different key while it was in flight", async () => {
        currentUserRef.current = { uid: "user-a" };
        setDocMock.mockRejectedValueOnce(new Error("offline"));
        saveData(KEYS.resume, { name: "v1" });
        await flushMicrotasks();
        expect(getPendingCount()).toBe(1);

        let resolveGetDoc: (v: unknown) => void = () => {};
        getDocMock.mockReturnValueOnce(new Promise((resolve) => { resolveGetDoc = resolve; }));
        setDocMock.mockResolvedValue(undefined);
        const flushPromise = flushPendingWrites();

        // While the flush is awaiting getDoc, a different key's save fails and queues.
        setDocMock.mockRejectedValueOnce(new Error("offline"));
        saveData(KEYS.roadmap, { step: 1 });
        await flushMicrotasks();

        resolveGetDoc({ exists: () => false, data: () => ({}) });
        await flushPromise;

        // roadmap's entry, queued while resume's flush was in flight, must survive.
        expect(getPendingCount()).toBe(1);
    });

    it("initUserData does not downgrade a key that has a newer unsynced local write than Firestore", async () => {
        currentUserRef.current = { uid: "user-a" };

        // A local write that's still queued (an offline edit not yet flushed).
        setDocMock.mockRejectedValueOnce(new Error("offline"));
        saveData(KEYS.roadmap, { step: "local-newer" });
        await flushMicrotasks();
        expect(getPendingCount()).toBe(1);

        // Firestore has an OLDER version of the same key. Use mockResolvedValue (not
        // -Once) since initUserData may also fire its own end-of-hydration flush,
        // which calls getDoc/setDoc again — both should stay harmless no-ops here.
        const olderRemote = JSON.stringify({
            __cg: true, value: { step: "remote-older" }, updatedAt: Date.now() - 100_000,
        });
        getDocMock.mockResolvedValue({ exists: () => true, data: () => ({ [KEYS.roadmap]: olderRemote }) });
        setDocMock.mockResolvedValue(undefined);

        await initUserData();

        // Local keeps its newer value rather than being overwritten by the older remote one.
        expect(loadData(KEYS.roadmap, null)).toEqual({ step: "local-newer" });
    });

    it("initUserData retries a transient failure and hydrates localStorage once a later attempt succeeds", async () => {
        currentUserRef.current = { uid: "user-a" };
        getDocMock
            .mockRejectedValueOnce(new Error("client is offline"))
            .mockResolvedValueOnce({ exists: () => true, data: () => ({ resume: '{"name":"Taha"}' }) });

        vi.useFakeTimers();
        const p = initUserData();
        await vi.runAllTimersAsync();
        await p;
        vi.useRealTimers();

        expect(getDocMock).toHaveBeenCalledTimes(2);
        expect(loadData(KEYS.resume, null)).toEqual({ name: "Taha" });
    });

    it("initUserData gives up after 3 consecutive failures instead of retrying forever", async () => {
        currentUserRef.current = { uid: "user-a" };
        getDocMock.mockRejectedValue(new Error("client is offline"));

        vi.useFakeTimers();
        const p = initUserData();
        await vi.runAllTimersAsync();
        await p;
        vi.useRealTimers();

        expect(getDocMock).toHaveBeenCalledTimes(3);
    });

    it("todayKey returns a YYYY-MM-DD string", () => {
        expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("dayDiff computes whole-day differences correctly", () => {
        expect(dayDiff("2026-01-05", "2026-01-01")).toBe(4);
        expect(dayDiff("2026-01-01", "2026-01-05")).toBe(-4);
        expect(dayDiff("2026-01-01", "2026-01-01")).toBe(0);
    });
});
