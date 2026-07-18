import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useEffectSkipMount } from "@/hooks/useEffectSkipMount";

describe("useEffectSkipMount", () => {
    it("does not fire on the initial mount", () => {
        const effect = vi.fn();
        renderHook(({ dep }) => useEffectSkipMount(effect, [dep]), {
            initialProps: { dep: 1 },
        });
        expect(effect).not.toHaveBeenCalled();
    });

    it("fires on subsequent dependency changes", () => {
        const effect = vi.fn();
        const { rerender } = renderHook(({ dep }) => useEffectSkipMount(effect, [dep]), {
            initialProps: { dep: 1 },
        });
        expect(effect).not.toHaveBeenCalled();

        rerender({ dep: 2 });
        expect(effect).toHaveBeenCalledTimes(1);

        rerender({ dep: 3 });
        expect(effect).toHaveBeenCalledTimes(2);
    });

    it("does not re-fire on a rerender with unchanged dependencies", () => {
        const effect = vi.fn();
        const { rerender } = renderHook(({ dep }) => useEffectSkipMount(effect, [dep]), {
            initialProps: { dep: 1 },
        });
        rerender({ dep: 1 });
        expect(effect).not.toHaveBeenCalled();
    });

    it("skips again on a fresh mount of a new instance (e.g. a dataVersion-keyed remount)", () => {
        // This is the exact scenario the hook exists for: DashboardLayout
        // remounts the page (via key={dataVersion}) once Firestore hydration
        // lands, seeding fresh state from the newly-synced localStorage. That
        // fresh mount's first render must NOT immediately re-save, or it would
        // just push back what hydration just pulled down.
        const effect = vi.fn();
        const { unmount } = renderHook(({ dep }) => useEffectSkipMount(effect, [dep]), {
            initialProps: { dep: 1 },
        });
        unmount();

        renderHook(({ dep }) => useEffectSkipMount(effect, [dep]), {
            initialProps: { dep: 99 },
        });
        expect(effect).not.toHaveBeenCalled();
    });
});
