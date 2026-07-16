import { useState } from "react";
import { ArrowRight, CheckCircle2, ClipboardCheck, Loader2, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { reviewProgress, type ProgressReview } from "@/lib/instructor";
import type { TabProps } from "./types";

export const ProgressTab = ({ persona, ctx }: TabProps) => {
    const [review, setReview] = useState<ProgressReview | null>(null);
    const [loading, setLoading] = useState(false);

    const run = async () => {
        setLoading(true);
        try {
            setReview(await reviewProgress(persona, ctx));
        } catch {
            toast.error("Review failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold mb-2 flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-primary" /> Progress review
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    {persona.name} reviews where you stand on your path to {ctx.career || "your career"} and tells you what to focus on next.
                </p>
                <button onClick={run} disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-semibold disabled:opacity-50 max-sm:min-h-11">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Reviewing…</> : <><Sparkles className="w-4 h-4" /> Review my progress</>}
                </button>
            </div>

            {review && (
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center font-display text-xl font-bold text-primary-foreground">
                            {review.grade}
                        </div>
                        <p className="text-sm text-foreground/90 flex-1">{review.summary}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Doing well</p>
                            <ul className="space-y-1.5">
                                {review.doingWell.map((d, i) => <li key={i} className="text-sm text-muted-foreground">• {d}</li>)}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1.5"><ArrowRight className="w-4 h-4" /> Focus next</p>
                            <ul className="space-y-1.5">
                                {review.focusNext.map((d, i) => <li key={i} className="text-sm text-muted-foreground">• {d}</li>)}
                            </ul>
                        </div>
                    </div>
                    {review.nextMilestone && (
                        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary shrink-0" />
                            <p className="text-sm"><span className="font-semibold">Next milestone:</span> {review.nextMilestone}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
