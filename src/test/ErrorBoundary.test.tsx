import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const currentUserRef: { current: { uid: string } | null } = { current: null };
vi.mock("@/lib/firebase", () => ({
    auth: {
        get currentUser() {
            return currentUserRef.current;
        },
    },
    db: {},
}));
vi.mock("firebase/firestore", () => ({
    doc: vi.fn(),
    setDoc: vi.fn().mockResolvedValue(undefined),
    getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => ({}) }),
    updateDoc: vi.fn().mockResolvedValue(undefined),
    deleteField: vi.fn(() => "DELETE_FIELD_SENTINEL"),
}));

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { KEYS, saveData, loadData } from "@/lib/userStore";

const Boom = () => {
    throw new Error("deterministic render crash");
};

describe("ErrorBoundary", () => {
    const assignMock = vi.fn();

    beforeEach(() => {
        localStorage.clear();
        currentUserRef.current = { uid: "user-a" };
        assignMock.mockClear();
        const original = window.location;
        Object.defineProperty(window, "location", {
            configurable: true,
            value: { ...original, assign: assignMock },
        });
    });

    it("shows the fallback instead of crashing the page", () => {
        render(
            <ErrorBoundary>
                <Boom />
            </ErrorBoundary>
        );
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("'Reset local data and reload' clears this user's local cache and navigates, unblocking crashes caused by corrupted local data", () => {
        // Regression test: "Try again" alone just re-renders the same subtree
        // against the same state, so a crash caused by corrupted localStorage
        // (not a timing fluke) re-throws instantly with no way out. This
        // button is the escape hatch -- Firestore is the source of truth, so
        // wiping the local cache is safe.
        saveData(KEYS.resume, { name: "Taha" });
        expect(loadData(KEYS.resume, null)).toEqual({ name: "Taha" });

        render(
            <ErrorBoundary>
                <Boom />
            </ErrorBoundary>
        );

        fireEvent.click(screen.getByText("Still broken? Reset local data and reload"));

        expect(loadData(KEYS.resume, null)).toBeNull();
        expect(assignMock).toHaveBeenCalledWith("/dashboard");
    });
});
