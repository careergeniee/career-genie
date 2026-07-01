import { useState } from "react";
import { cn } from "@/lib/utils";

/* ─── Mini UI previews — one per module ─────────────────────────── */

const AssessmentPreview = () => (
    <div className="p-3 space-y-2">
        <div className="text-[8px] font-bold text-violet-500 uppercase tracking-wider">Question 3 / 12</div>
        <div className="bg-white rounded-lg p-2 space-y-1.5 shadow-sm">
            {[["Problem solving", true], ["Leadership", false], ["Technical", false]].map(([label, checked]) => (
                <div key={label as string} className="flex items-center gap-1.5">
                    <div className={cn("w-2.5 h-2.5 rounded-full border-2 shrink-0", checked ? "bg-violet-500 border-violet-500" : "border-gray-300")} />
                    <span className="text-[9px] text-gray-600">{label as string}</span>
                </div>
            ))}
        </div>
        <div className="w-full h-5 rounded-md bg-violet-500 flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">Next →</span>
        </div>
    </div>
);

const CareerMatchPreview = () => (
    <div className="p-3 space-y-2">
        <div className="text-[8px] font-bold text-blue-500 uppercase tracking-wider">Top Matches</div>
        {[["Software Eng.", 94, "bg-blue-500"], ["Data Scientist", 78, "bg-blue-300"], ["DevOps Eng.", 61, "bg-blue-200"]].map(([label, pct, bar]) => (
            <div key={label as string}>
                <div className="flex justify-between mb-0.5">
                    <span className="text-[8px] text-gray-600">{label as string}</span>
                    <span className="text-[8px] font-bold text-blue-600">{pct as number}%</span>
                </div>
                <div className="w-full h-1.5 bg-blue-100 rounded-full">
                    <div className={cn("h-full rounded-full", bar as string)} style={{ width: `${pct}%` }} />
                </div>
            </div>
        ))}
    </div>
);

const ChatbotPreview = () => (
    <div className="p-3 space-y-1.5">
        <div className="flex items-center gap-1 mb-2">
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <span className="text-[6px] text-white font-bold">G</span>
            </div>
            <span className="text-[8px] font-bold text-gray-700">AI Mentor</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 ml-auto" />
        </div>
        <div className="bg-white rounded-xl rounded-bl-none px-2 py-1.5 shadow-sm max-w-[85%]">
            <p className="text-[8px] text-gray-600">What career suits a CS grad?</p>
        </div>
        <div className="bg-primary rounded-xl rounded-br-none px-2 py-1.5 max-w-[90%] ml-auto">
            <p className="text-[8px] text-white font-medium">Software Eng. & Data Science!</p>
        </div>
    </div>
);

const ResumePreview = () => (
    <div className="p-3">
        <div className="bg-white rounded-lg p-2 shadow-sm space-y-1.5">
            <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 shrink-0" />
                <div className="space-y-0.5">
                    <div className="w-16 h-1.5 bg-gray-800 rounded" />
                    <div className="w-10 h-1 bg-gray-300 rounded" />
                </div>
            </div>
            <div className="border-t border-gray-100 pt-1 space-y-0.5">
                <div className="w-8 h-1 bg-emerald-400 rounded" />
                <div className="w-full h-1 bg-gray-200 rounded" />
                <div className="w-4/5 h-1 bg-gray-200 rounded" />
                <div className="w-3/5 h-1 bg-gray-200 rounded" />
            </div>
            <div className="flex gap-1 pt-0.5">
                {["React", "Python"].map(s => (
                    <span key={s} className="text-[7px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded">{s}</span>
                ))}
            </div>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[8px] text-gray-500">ATS Score</span>
            <span className="text-[10px] font-bold text-emerald-600">94%</span>
        </div>
    </div>
);

const InterviewPreview = () => (
    <div className="p-3 flex flex-col items-center justify-center gap-1.5">
        <div className="text-[8px] font-bold text-orange-500 uppercase tracking-wider">Session Score</div>
        <div className="relative w-14 h-14 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#fed7aa" strokeWidth="3" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f97316" strokeWidth="3"
                    strokeDasharray={`${87 * 0.88} 100`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[14px] font-display font-bold text-orange-600 leading-none">87</span>
                <span className="text-[7px] text-gray-400">/100</span>
            </div>
        </div>
        <div className="flex gap-0.5">
            {[1,2,3,4].map(s => <div key={s} className="w-2 h-2 rounded-sm bg-orange-400" />)}
            <div className="w-2 h-2 rounded-sm bg-orange-100" />
        </div>
    </div>
);

const RoadmapPreview = () => (
    <div className="p-3 space-y-1.5">
        <div className="text-[8px] font-bold text-cyan-500 uppercase tracking-wider">Your Path</div>
        {[["Foundations", true, true], ["Core Skills", true, false], ["Projects", false, false], ["Career Ready", false, false]].map(([phase, done, active]) => (
            <div key={phase as string} className="flex items-center gap-1.5">
                <div className={cn("w-3 h-3 rounded-full shrink-0 flex items-center justify-center",
                    done ? "bg-cyan-500" : active ? "bg-cyan-200 border-2 border-cyan-400" : "bg-gray-200"
                )}>
                    {done && <span className="text-white text-[6px]">✓</span>}
                </div>
                <span className={cn("text-[8px]", done ? "text-cyan-600 font-medium line-through" : active ? "text-cyan-700 font-bold" : "text-gray-400")}>
                    {phase as string}
                </span>
            </div>
        ))}
    </div>
);

const InstructorPreview = () => (
    <div className="p-3 space-y-1.5">
        <div className="text-[8px] font-bold text-rose-500 uppercase tracking-wider">Today's Task</div>
        <div className="bg-white rounded-lg p-2 shadow-sm space-y-1.5">
            {[["Read Chapter 4", true], ["Write summary", true], ["Practice quiz", false]].map(([task, done]) => (
                <div key={task as string} className="flex items-center gap-1.5">
                    <div className={cn("w-3 h-3 rounded border shrink-0 flex items-center justify-center",
                        done ? "bg-rose-500 border-rose-500" : "border-gray-300"
                    )}>
                        {done && <span className="text-white text-[7px] font-bold">✓</span>}
                    </div>
                    <span className={cn("text-[8px]", done ? "text-gray-400 line-through" : "text-gray-700")}>{task as string}</span>
                </div>
            ))}
        </div>
        <div className="w-full h-4 rounded bg-rose-500 flex items-center justify-center">
            <span className="text-[7px] font-bold text-white">Mark Done</span>
        </div>
    </div>
);

/* ─── Card data ──────────────────────────────────────────────────── */

const CARDS = [
    { label: "Career Assessment", detail: "96.4% accuracy", color: "text-violet-600", bg: "bg-violet-50",   border: "border-violet-100",  preview: <AssessmentPreview /> },
    { label: "Career Match",      detail: "Top match",      color: "text-blue-600",   bg: "bg-blue-50",     border: "border-blue-100",    preview: <CareerMatchPreview /> },
    { label: "AI Chatbot",        detail: "Always online",  color: "text-primary",    bg: "bg-primary/10",  border: "border-primary/20",  preview: <ChatbotPreview /> },
    { label: "Resume Builder",    detail: "PDF export",     color: "text-emerald-600",bg: "bg-emerald-50",  border: "border-emerald-100", preview: <ResumePreview /> },
    { label: "Interview Prep",    detail: "AI graded",      color: "text-orange-500", bg: "bg-orange-50",   border: "border-orange-100",  preview: <InterviewPreview /> },
    { label: "Roadmap",           detail: "Week by week",   color: "text-cyan-600",   bg: "bg-cyan-50",     border: "border-cyan-100",    preview: <RoadmapPreview /> },
    { label: "Instructor",        detail: "1:1 mentorship", color: "text-rose-600",   bg: "bg-rose-50",     border: "border-rose-100",    preview: <InstructorPreview /> },
];

/* ─── Showcase ───────────────────────────────────────────────────── */

const CARD_W = 148;
const GAP    = 14;
// Amount each card translates to collapse onto the center card (index 3)
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
            {/* Flex row — natural positions ARE the spread positions.
                translateX pulls cards to center when stacked. */}
            <div className="flex justify-center overflow-visible" style={{ gap: GAP }}>
                {CARDS.map((card, i) => {
                    const tx  = open ? 0 : stackShift(i);
                    const rot = open ? 0 : (i - 3) * 2.5;
                    const ty  = open ? 0 : Math.abs(i - 3) * 4;
                    // left → right stagger when opening; right → left when closing
                    const delay = open ? i * 55 : (CARDS.length - 1 - i) * 38;

                    return (
                        <div
                            key={card.label}
                            className="shrink-0 overflow-visible"
                            style={{
                                width: CARD_W,
                                transform: `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg)`,
                                transition: `transform 0.52s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
                                zIndex: open ? 1 : 10 - Math.abs(i - 3),
                                position: "relative",
                            }}
                        >
                            <div className={cn(
                                "rounded-2xl border bg-white shadow-lg overflow-hidden",
                                "hover:-translate-y-1 transition-[box-shadow,transform] duration-200",
                                open && "shadow-xl",
                                card.border,
                            )}>
                                {/* Mini screenshot */}
                                <div className={cn("h-28 overflow-hidden", card.bg)}>
                                    {card.preview}
                                </div>
                                {/* Label */}
                                <div className="px-3 py-2.5 border-t border-gray-100">
                                    <p className={cn("font-display font-bold text-[12px] leading-tight", card.color)}>
                                        {card.label}
                                    </p>
                                    <span className="text-[10px] text-muted-foreground">{card.detail}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Hint */}
            <p
                className="mt-5 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5 pointer-events-none transition-opacity duration-300"
                style={{ opacity: open ? 0 : 1 }}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
                hover to explore all tools
            </p>
        </div>
    );
};
