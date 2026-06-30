import { useState } from "react";
import { Bot, FileText, MessageSquare, Map, GraduationCap, ClipboardList, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const CARDS = [
    {
        icon: ClipboardList,
        label: "Career Assessment",
        sample: "Skill profile built",
        detail: "96.4% accuracy",
        color: "text-violet-600",
        bg: "bg-violet-100",
        border: "border-violet-100",
    },
    {
        icon: Target,
        label: "Career Match",
        sample: "Software Engineer",
        detail: "Top match",
        color: "text-blue-600",
        bg: "bg-blue-100",
        border: "border-blue-100",
    },
    {
        icon: Bot,
        label: "AI Chatbot",
        sample: "Career fits a CS grad?",
        detail: "Always online",
        color: "text-primary",
        bg: "bg-primary/15",
        border: "border-primary/20",
    },
    {
        icon: FileText,
        label: "Resume Builder",
        sample: "ATS score: 94%",
        detail: "PDF export",
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        border: "border-emerald-100",
    },
    {
        icon: MessageSquare,
        label: "Interview Prep",
        sample: "Score: 87 / 100",
        detail: "AI graded",
        color: "text-orange-500",
        bg: "bg-orange-100",
        border: "border-orange-100",
    },
    {
        icon: Map,
        label: "Roadmap",
        sample: "Phase 2 of 4",
        detail: "Week by week",
        color: "text-cyan-600",
        bg: "bg-cyan-100",
        border: "border-cyan-100",
    },
    {
        icon: GraduationCap,
        label: "Instructor",
        sample: "Today's task ready",
        detail: "1:1 mentorship",
        color: "text-rose-600",
        bg: "bg-rose-100",
        border: "border-rose-100",
    },
];

const CARD_W = 140;
const GAP    = 14;
// translateX to bring card i to the center (card index 3) when stacked
const stackShift = (i: number) => (3 - i) * (CARD_W + GAP);

export const HeroShowcase = () => {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="overflow-visible cursor-pointer"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onClick={() => setOpen((v) => !v)}
        >
            {/* Flex row — cards sit at their natural spread positions,
                then translateX back to center when stacked */}
            <div className="flex items-end overflow-visible" style={{ gap: GAP }}>
                {CARDS.map((card, i) => {
                    const tx = open ? 0 : stackShift(i);
                    // Slight rotation in stack; straight when fanned
                    const rot = open ? 0 : (i - 3) * 2.5;
                    // Cards at edges drop slightly in the stack
                    const ty = open ? 0 : Math.abs(i - 3) * 4;
                    // Stagger: left → right when opening, right → left when closing
                    const delay = open ? i * 55 : (CARDS.length - 1 - i) * 40;
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className="shrink-0 overflow-visible"
                            style={{
                                width: CARD_W,
                                transform: `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg)`,
                                transition: `transform 0.52s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
                                // Center card sits on top of the stack
                                zIndex: open ? 1 : 10 - Math.abs(i - 3),
                                position: "relative",
                            }}
                        >
                            <div className={cn(
                                "rounded-2xl border bg-white shadow-lg p-4 h-full",
                                card.border,
                            )}>
                                {/* Icon */}
                                <div className={cn(
                                    "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
                                    card.bg,
                                )}>
                                    <Icon className={cn("w-[18px] h-[18px]", card.color)} />
                                </div>

                                {/* Name — always in the card, visible once fanned */}
                                <p className="font-display font-bold text-[13px] leading-tight mb-1 text-foreground">
                                    {card.label}
                                </p>
                                <p className="text-[11px] text-muted-foreground leading-snug mb-2.5">
                                    {card.sample}
                                </p>
                                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                                    {card.detail}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Hint */}
            <p
                className="mt-4 text-[11px] text-muted-foreground flex items-center gap-1.5 pointer-events-none transition-opacity duration-300"
                style={{ opacity: open ? 0 : 1 }}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
                hover to explore all tools
            </p>
        </div>
    );
};
