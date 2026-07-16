import { Check, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStack, isKnown, type StackGroup } from "@/lib/careerStacks";

interface TechStackPanelProps {
    goal: string;
    skills: string;
    stack?: StackGroup[];
}

export const TechStackPanel = ({ goal, skills, stack }: TechStackPanelProps) => {
    const groups = stack ?? getStack(goal);
    if (!groups || groups.length === 0) {
        return (
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 mb-5">
                <p className="text-xs text-muted-foreground">
                    We'll tailor the full technology stack for <span className="text-foreground font-medium">{goal}</span> automatically when you generate the roadmap.
                </p>
            </div>
        );
    }

    const allItems = groups.flatMap((g) => g.items);
    const knownCount = allItems.filter((t) => isKnown(t, skills)).length;

    return (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-5">
            <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                    <Layers className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <h4 className="font-display font-bold text-sm min-w-0 break-words">
                        Technologies for {goal}
                    </h4>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">
                    {allItems.length - knownCount} to learn · {knownCount} known
                </span>
            </div>

            <div className="space-y-3">
                {groups.map((g) => (
                    <div key={g.category}>
                        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">
                            {g.category}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {g.items.map((tech) => {
                                const known = isKnown(tech, skills);
                                return (
                                    <span
                                        key={tech}
                                        className={cn(
                                            "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border",
                                            known
                                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                                                : "border-border/60 bg-secondary/40 text-foreground"
                                        )}
                                    >
                                        {known && <Check className="w-3 h-3" />}
                                        {tech}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-[11px] text-muted-foreground mt-3">
                Covers the full path for this field. Items you already know are marked and skipped in your roadmap.
            </p>
        </div>
    );
};
