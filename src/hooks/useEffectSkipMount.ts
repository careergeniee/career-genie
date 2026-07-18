import { useEffect, useRef, type DependencyList } from "react";

/**
 * Like useEffect, but never fires on the run that happens at mount — only on
 * subsequent dependency changes. For "save this to the backend on change"
 * effects seeded from loadData(seed-or-empty-default): without this, the
 * effect's first run fires immediately with whatever placeholder/empty value
 * was loaded before Firestore hydration lands, pushing it to Firestore and
 * overwriting the user's real synced data. Also correctly re-skips after a
 * dataVersion-triggered remount, since that's a fresh mount of a fresh
 * component instance — exactly the case where firing early would be both
 * wrong (transiently) and redundant (saving back what hydration just pulled).
 */
export function useEffectSkipMount(effect: () => void | (() => void), deps: DependencyList): void {
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        return effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
