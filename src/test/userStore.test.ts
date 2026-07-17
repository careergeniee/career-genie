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
const { updateDocMock } = vi.hoisted(() => ({
    updateDocMock: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("firebase/firestore", () => ({
    doc: vi.fn(),
    setDoc: vi.fn().mockResolvedValue(undefined),
    getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => ({}) }),
    updateDoc: updateDocMock,
    deleteField: vi.fn(() => "DELETE_FIELD_SENTINEL"),
}));

import { loadData, saveData, removeData, clearUserData, KEYS, todayKey, dayDiff } from "@/lib/userStore";

describe("userStore", () => {
    beforeEach(() => {
        localStorage.clear();
        currentUserRef.current = null;
        updateDocMock.mockClear();
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

    it("todayKey returns a YYYY-MM-DD string", () => {
        expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("dayDiff computes whole-day differences correctly", () => {
        expect(dayDiff("2026-01-05", "2026-01-01")).toBe(4);
        expect(dayDiff("2026-01-01", "2026-01-05")).toBe(-4);
        expect(dayDiff("2026-01-01", "2026-01-01")).toBe(0);
    });
});
