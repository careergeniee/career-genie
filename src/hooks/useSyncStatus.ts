import { useEffect, useState } from "react";
import { getPendingCount, onSyncStatusChange } from "@/lib/userStore";

/** Number of local writes that haven't reached Firestore yet, live-updated. Drives the sync-failed UI indicator. */
export function useSyncStatus(): number {
    const [pendingCount, setPendingCount] = useState(getPendingCount);

    useEffect(() => {
        const update = () => setPendingCount(getPendingCount());
        update(); // pick up writes queued before this component mounted
        return onSyncStatusChange(update);
    }, []);

    return pendingCount;
}
