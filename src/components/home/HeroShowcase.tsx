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

// Full spread angles when fanned (-78° → +78° in 26° steps)
const FAN_ANGLES   = [-78, -52, -26, 0, 26, 52, 78];
// Tight cluster in rest — slight variation shows deck depth
const STACK_ANGLES = [-9, -6, -3, 0, 3, 6, 9];

export const HeroShowcase = () => {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative flex items-end justify-center cursor-pointer select-none"
            style={{ height: 300, width: "100%", maxWidth: 520 }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onClick={() => setOpen((v) => !v)}
            aria-label="Explore modules"
        >
            {CARDS.map((card, i) => {
                const rotation = open ? FAN_ANGLES[i] : STACK_ANGLES[i];
                // Outer cards animate first on open; inner cards first on close
                const delay = open
                    ? Math.abs(i - 3) * 40
                    : (CARDS.length - 1 - Math.abs(i - 3)) * 28;
                const Icon = card.icon;

                return (
                    <div
                        key={card.label}
                        className="absolute bottom-8"
                        style={{
                            left: "50%",
                            width: 148,
                            marginLeft: -74,
                            // Pivot 55% of card height below its own bottom edge — creates wide arc
                            transformOrigin: "50% 155%",
                            transform: `rotate(${rotation}deg)`,
                            transition: `transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
                            zIndex: CARDS.length - Math.abs(i - 3),
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

            {/* Hint — fades out when open */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[11px] text-muted-foreground pointer-events-none transition-opacity duration-300"
                style={{ opacity: open ? 0 : 1 }}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                hover to explore all tools
            </div>
        </div>
    );
};
