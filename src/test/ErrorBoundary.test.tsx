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

const BoomChunkLoad = () => {
    throw new Error("Failed to fetch dynamically imported module: https://app.example/assets/Resume-abc123.js");
};

describe("ErrorBoundary", () => {
    const assignMock = vi.fn();
    const reloadMock = vi.fn();

    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        currentUserRef.current = { uid: "user-a" };
        assignMock.mockClear();
        reloadMock.mockClear();
        const original = window.location;
        Object.defineProperty(window, "location", {
            configurable: true,
            value: { ...original, assign: assignMock, reload: reloadMock },
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

    it("auto-reloads once when a stale-chunk 404 is caught (post-deploy, tab left open across a new build)", () => {
        // Regression test: almost every route is lazy() with content-hashed
        // filenames, and Vercel only serves the current deployment's assets --
        // so a tab open across a deploy that navigates to a not-yet-loaded
        // route hits a real 404, surfaced as this specific dynamic-import
        // rejection message. A full reload (fresh index.html, new hashes)
        // fixes it -- the boundary should do that automatically instead of
        // showing "something went wrong" for what's really just a stale build.
        render(
            <ErrorBoundary>
                <BoomChunkLoad />
            </ErrorBoundary>
        );

        expect(reloadMock).toHaveBeenCalledTimes(1);
        expect(sessionStorage.getItem("cg:chunk-reload-attempted")).toBe("1");
    });

    it("does not reload-loop if a chunk-load error recurs after the one auto-reload already happened this tab session", () => {
        sessionStorage.setItem("cg:chunk-reload-attempted", "1");

        render(
            <ErrorBoundary>
                <BoomChunkLoad />
            </ErrorBoundary>
        );

        expect(reloadMock).not.toHaveBeenCalled();
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
});
