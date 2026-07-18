import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearUserData } from "@/lib/userStore";

interface Props {
    children: ReactNode;
}
interface State {
    hasError: boolean;
    message?: string;
}

// Nearly every route in App.tsx is lazy(). Chunk filenames are content-hashed,
// and Vercel only serves the current deployment's assets -- so a tab left open
// across a deploy (very likely for a PWA) that then navigates to a not-yet-
// loaded route requests an old-hashed chunk that now 404s. Browsers report
// that as a dynamic-import rejection with one of these messages depending on
// engine; usePwaUpdatePrompt's toast doesn't cover this because it only fires
// once *this* tab's service worker notices an update, which can lag behind
// the CDN already having dropped the old build's files.
const CHUNK_LOAD_ERROR_RE = /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i;
const CHUNK_RELOAD_FLAG = "cg:chunk-reload-attempted";

/**
 * Catches render-time errors anywhere in the tree below it and shows a
 * recoverable fallback instead of a blank white screen. This keeps the
 * app reliable even if a single page throws unexpectedly.
 */
export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, message: error.message };
    }

    componentDidCatch(error: Error, info: unknown) {
        // Log for debugging; in production this could report to a service.
        console.error("ErrorBoundary caught an error:", error, info);

        // A full reload fetches the fresh index.html (new chunk hashes) and
        // fixes this on its own -- do it once automatically instead of
        // showing a scary "something went wrong" screen for what's really
        // just a stale build. Guarded by a per-tab flag so a genuine repeat
        // failure (real bug, not staleness) falls through to the normal
        // fallback UI instead of reload-looping.
        if (CHUNK_LOAD_ERROR_RE.test(error.message)) {
            try {
                if (!sessionStorage.getItem(CHUNK_RELOAD_FLAG)) {
                    sessionStorage.setItem(CHUNK_RELOAD_FLAG, "1");
                    window.location.reload();
                }
            } catch {
                /* sessionStorage unavailable (e.g. some private-browsing modes) -- fall through to manual UI */
            }
        }
    }

    private reset = () => this.setState({ hasError: false, message: undefined });

    // "Try again" alone just re-renders the same subtree against the same
    // state -- if the crash is caused by corrupted data sitting in
    // localStorage (not a one-off timing fluke), it re-throws instantly and
    // there is no way out of the fallback screen. Firestore is the source of
    // truth (see userStore's sync queue), so wiping the local cache and
    // reloading is safe -- the next sign-in re-hydrates from Firestore.
    private resetLocalData = () => {
        clearUserData();
        window.location.assign("/dashboard");
    };

    render() {
        if (!this.state.hasError) return this.props.children;
        return (
            <div className="min-h-screen hero-bg flex items-center justify-center p-6">
                <div className="glass-card rounded-2xl p-10 text-center max-w-md">
                    <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="font-display text-2xl font-bold mb-2">Something went wrong</h2>
                    <p className="text-muted-foreground mb-6">
                        An unexpected error interrupted this page. You can try again, or reload
                        the app.
                    </p>
                    {this.state.message && (
                        <p className="text-xs text-muted-foreground/70 mb-6 font-mono break-words">
                            {this.state.message}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Button variant="hero" onClick={this.reset}>
                            <RotateCcw className="w-4 h-4" /> Try again
                        </Button>
                        <Button variant="ghost" onClick={() => window.location.assign("/dashboard")}>
                            Go to dashboard
                        </Button>
                    </div>
                    <button
                        onClick={this.resetLocalData}
                        className="mt-4 text-xs text-muted-foreground/70 hover:text-destructive transition-colors underline"
                    >
                        Still broken? Reset local data and reload
                    </button>
                </div>
            </div>
        );
    }
}
