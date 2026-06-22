import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    children: ReactNode;
}
interface State {
    hasError: boolean;
    message?: string;
}

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
    }

    private reset = () => this.setState({ hasError: false, message: undefined });

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
                    <div className="flex gap-3 justify-center">
                        <Button variant="hero" onClick={this.reset}>
                            <RotateCcw className="w-4 h-4" /> Try again
                        </Button>
                        <Button variant="ghost" onClick={() => window.location.assign("/dashboard")}>
                            Go to dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;
