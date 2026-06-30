import { useState } from "react";
import { Bot, FileText, MessageSquare, Map, GraduationCap, ClipboardList, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const CARDS = [
    {
        icon: ClipboardList,
        label: "Assessment",
        sample: "Skill profile built",
        detail: "96.4% accuracy",
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-100",
    },
    {
        icon: Target,
        label: "Career Match",
        sample: "Software Engineer",
        detail: "Top match",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
    },
    {
        icon: Bot,
        label: "AI Chatbot",
        sample: "Career fits a CS grad?",
        detail: "Always online",
        color: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/20",
    },
    {
        icon: FileText,
        label: "Resume Builder",
        sample: "ATS score: 94%",
        detail: "PDF export",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
    },
    {
        icon: MessageSquare,
        label: "Interview Prep",
        sample: "Score: 87/100",
        detail: "AI graded",
        color: "text-orange-500",
        bg: "bg-orange-50",
        border: "border-orange-100",
    },
    {
        icon: Map,
        label: "Roadmap",
        sample: "Phase 2 of 4",
        detail: "Week by week",
        color: "text-cyan-600",
        bg: "bg-cyan-50",
        border: "border-cyan-100",
    },
    {
        icon: GraduationCap,
        label: "Instructor",
        sample: "Today's task ready",
        detail: "1:1 mentorship",
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-100",
    },
];

// Pivot is at the bottom-left corner of each card (like the SO logo spine).
// Positive rotation = clockwise = card leans right from upright.
// FAN: nearly upright (5°) → nearly flat (71°), 11° steps.
const FAN_ANGLES   = [5, 16, 27, 38, 49, 60, 71];
// STACK: clustered tightly around 38° so the deck looks natural at rest.
const STACK_ANGLES = [32, 35, 38, 41, 44, 47, 50];

export const HeroShowcase = () => {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative cursor-pointer select-none overflow-visible"
            style={{ height: 260 }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onClick={() => setOpen((v) => !v)}
            aria-label="Explore modules"
        >
            {CARDS.map((card, i) => {
                const rotation = open ? FAN_ANGLES[i] : STACK_ANGLES[i];
                // Stagger outward from the first card when opening
                const delay = open ? i * 45 : (CARDS.length - 1 - i) * 30;
                const Icon = card.icon;

                return (
                    <div
                        key={card.label}
                        className="absolute bottom-0 left-6"
                        style={{
                            width: 156,
                            // Pivot at BOTTOM-LEFT corner — identical to SO logo spine
                            transformOrigin: "0% 100%",
                            transform: `rotate(${rotation}deg)`,
                            transition: `transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
                            // Top card (index 0, least rotated) sits on top of the deck
                            zIndex: CARDS.length - i,
                        }}
                    >
                        <div className={cn(
                            "rounded-2xl border bg-white shadow-lg p-4",
                            card.border,
                        )}>
                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", card.bg)}>
                                <Icon className={cn("w-[18px] h-[18px]", card.color)} />
                            </div>
                            <p className="font-display font-bold text-[13px] leading-tight mb-0.5 text-foreground">
                                {card.label}
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-snug mb-2">
                                {card.sample}
                            </p>
                            <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                                {card.detail}
                            </span>
                        </div>
                    </div>
                );
            })}

            {/* Hint */}
            <p
                className="absolute -bottom-6 left-6 text-[11px] text-muted-foreground flex items-center gap-1.5 pointer-events-none transition-opacity duration-300"
                style={{ opacity: open ? 0 : 1 }}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
                hover to explore all tools
            </p>
        </div>
    );
};
