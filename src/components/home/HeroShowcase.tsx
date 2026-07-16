import { useEffect, useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

/* ─── Mini UI previews — one per module ─────────────────────────── */

const AssessmentPreview = () => (
    <div className="p-3 space-y-2">
        <div className="text-[8px] font-bold text-primary uppercase tracking-wider">Question 3 / 12</div>
        <div className="bg-white rounded-lg p-2 space-y-1.5 shadow-sm">
            {[["Problem solving", true], ["Leadership", false], ["Technical", false]].map(([label, checked]) => (
                <div key={label as string} className="flex items-center gap-1.5">
                    <div className={cn("w-2.5 h-2.5 rounded-full border-2 shrink-0", checked ? "bg-primary border-primary" : "border-gray-300")} />
                    <span className="text-[9px] text-gray-600">{label as string}</span>
                </div>
            ))}
        </div>
        <div className="w-full h-5 rounded-md bg-primary flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">Next →</span>
        </div>
    </div>
);

const CareerMatchPreview = () => (
    <div className="p-3 space-y-2">
        <div className="text-[8px] font-bold text-primary uppercase tracking-wider">Top Matches</div>
        {[["Software Eng.", 94, "bg-primary"], ["Data Scientist", 78, "bg-primary/60"], ["DevOps Eng.", 61, "bg-primary/30"]].map(([label, pct, bar]) => (
            <div key={label as string}>
                <div className="flex justify-between mb-0.5">
                    <span className="text-[8px] text-gray-600">{label as string}</span>
                    <span className="text-[8px] font-bold text-primary">{pct as number}%</span>
                </div>
                <div className="w-full h-1.5 bg-primary/10 rounded-full">
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
                <div className="w-5 h-5 rounded-full bg-primary/10 shrink-0" />
                <div className="space-y-0.5">
                    <div className="w-16 h-1.5 bg-gray-800 rounded" />
                    <div className="w-10 h-1 bg-gray-300 rounded" />
                </div>
            </div>
            <div className="border-t border-gray-100 pt-1 space-y-0.5">
                <div className="w-8 h-1 bg-primary rounded" />
                <div className="w-full h-1 bg-gray-200 rounded" />
                <div className="w-4/5 h-1 bg-gray-200 rounded" />
                <div className="w-3/5 h-1 bg-gray-200 rounded" />
            </div>
            <div className="flex gap-1 pt-0.5">
                {["React", "Python"].map(s => (
                    <span key={s} className="text-[7px] bg-primary/10 text-primary px-1 py-0.5 rounded">{s}</span>
                ))}
            </div>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[8px] text-gray-500">ATS Score</span>
            <span className="text-[10px] font-bold text-primary">94%</span>
        </div>
    </div>
);

const InterviewPreview = () => (
    <div className="p-3 flex flex-col items-center justify-center gap-1.5">
        <div className="text-[8px] font-bold text-primary uppercase tracking-wider">Session Score</div>
        <div className="relative w-14 h-14 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="3" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
                    strokeDasharray={`${87 * 0.88} 100`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[14px] font-display font-bold text-primary leading-none">87</span>
                <span className="text-[7px] text-gray-400">/100</span>
            </div>
        </div>
        <div className="flex gap-0.5">
            {[1,2,3,4].map(s => <div key={s} className="w-2 h-2 rounded-sm bg-primary/70" />)}
            <div className="w-2 h-2 rounded-sm bg-primary/15" />
        </div>
    </div>
);

const RoadmapPreview = () => (
    <div className="p-3 space-y-1.5">
        <div className="text-[8px] font-bold text-primary uppercase tracking-wider">Your Path</div>
        {[["Foundations", true, true], ["Core Skills", true, false], ["Projects", false, false], ["Career Ready", false, false]].map(([phase, done, active]) => (
            <div key={phase as string} className="flex items-center gap-1.5">
                <div className={cn("w-3 h-3 rounded-full shrink-0 flex items-center justify-center",
                    done ? "bg-primary" : active ? "bg-primary/20 border-2 border-primary/50" : "bg-gray-200"
                )}>
                    {done && <span className="text-white text-[6px]">✓</span>}
                </div>
                <span className={cn("text-[8px]", done ? "text-primary font-medium line-through" : active ? "text-primary font-bold" : "text-gray-400")}>
                    {phase as string}
                </span>
            </div>
        ))}
    </div>
);

const InstructorPreview = () => (
    <div className="p-3 space-y-1.5">
        <div className="text-[8px] font-bold text-primary uppercase tracking-wider">Today's Task</div>
        <div className="bg-white rounded-lg p-2 shadow-sm space-y-1.5">
            {[["Read Chapter 4", true], ["Write summary", true], ["Practice quiz", false]].map(([task, done]) => (
                <div key={task as string} className="flex items-center gap-1.5">
                    <div className={cn("w-3 h-3 rounded border shrink-0 flex items-center justify-center",
                        done ? "bg-primary border-primary" : "border-gray-300"
                    )}>
                        {done && <span className="text-white text-[7px] font-bold">✓</span>}
                    </div>
                    <span className={cn("text-[8px]", done ? "text-gray-400 line-through" : "text-gray-700")}>{task as string}</span>
                </div>
            ))}
        </div>
        <div className="w-full h-4 rounded bg-primary flex items-center justify-center">
            <span className="text-[7px] font-bold text-white">Mark Done</span>
        </div>
    </div>
);

/* ─── Card data ──────────────────────────────────────────────────── */

const CARDS = [
    {
        label: "Career Assessment", detail: "96.4% accuracy", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", preview: <AssessmentPreview />,
        tagline: "Find your best-fit career in 20 questions",
        desc: "A structured, AI-scored assessment that reads your skills, interests, and personality traits to reveal which career paths fit you best.",
        features: ["20-question assessment", "AI career prediction", "Strength analysis", "Instant results"],
        cta: "Take the assessment",
    },
    {
        label: "Career Match", detail: "Top match", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", preview: <CareerMatchPreview />,
        tagline: "Ranked careers, matched to you",
        desc: "See every career path ranked by how well it fits your personality and skills, each with a confidence score so you know how sure the match is.",
        features: ["Ranked by fit score", "Personality + skills blend", "Confidence indicator", "Updates after every assessment"],
        cta: "See my matches",
    },
    {
        label: "AI Chatbot", detail: "Always online", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", preview: <ChatbotPreview />,
        tagline: "Your 24/7 career copilot",
        desc: "Conversational AI that understands your goals, your industry, and your potential. Ask anything — from salary negotiation to skill gaps — and get expert-grade answers in seconds.",
        features: ["Trained on real career conversations", "Industry-specific guidance", "Personalized to your profile", "Available 24/7 across devices"],
        cta: "Start chatting",
    },
    {
        label: "Resume Builder", detail: "PDF export", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", preview: <ResumePreview />,
        tagline: "ATS-friendly resumes in minutes",
        desc: "Craft polished, recruiter-approved resumes with AI-driven content suggestions, real-time ATS scoring, and clean templates that stand out.",
        features: ["Live preview editor", "AI bullet-point rewriter", "Live ATS score", "One-click PDF export"],
        cta: "Build my resume",
    },
    {
        label: "Interview Prep", detail: "AI graded", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", preview: <InterviewPreview />,
        tagline: "Practice until you're unstoppable",
        desc: "Realistic mock interviews with AI that listens, scores, and coaches you on tone, clarity, and content — so you walk into the real thing with confidence.",
        features: ["Role-specific question banks", "Voice input support", "AI feedback & scoring", "Unlimited practice sessions"],
        cta: "Start practicing",
    },
    {
        label: "Roadmap", detail: "Week by week", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", preview: <RoadmapPreview />,
        tagline: "Step-by-step paths to your dream role",
        desc: "Personalized roadmaps that show exactly which skills, projects, and certifications to pursue — in the right order — to reach your target role.",
        features: ["Personalized to your goals", "Milestone tracking", "Curated resources", "Adjustable timelines"],
        cta: "View my roadmap",
    },
    {
        label: "Instructor", detail: "1:1 mentorship", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", preview: <InstructorPreview />,
        tagline: "Mentorship from those who've done it",
        desc: "Get matched with an AI-guided senior instructor for structured lessons, daily tasks, and 1:1-style coaching on career strategy and technical depth.",
        features: ["Structured curriculum", "Daily tasks & quizzes", "Progress tracking", "Follow-up Q&A"],
        cta: "Find a mentor",
    },
];

/* ─── Showcase ───────────────────────────────────────────────────── */

const CARD_W = 148;
const GAP    = 14;
// Amount each card translates to collapse onto the center card (index 3)
const stackShift = (i: number) => (3 - i) * (CARD_W + GAP);

// Transform transition timing (kept as named constants so the scroll-centering effect
// below can wait for the same duration it takes the cards to visually finish spreading).
const CARD_TRANSITION_MS = 520; // matches the "0.52s" transform transition
const OPEN_STAGGER_MS    = 55;  // per-card delay step, left → right, when opening
const CLOSE_STAGGER_MS   = 38;  // per-card delay step, right → left, when closing
// Time for the last (most-delayed) card's open transition to finish.
const OPEN_ANIMATION_MS = (CARDS.length - 1) * OPEN_STAGGER_MS + CARD_TRANSITION_MS;

interface HeroShowcaseProps {
    /** Ref to the ancestor scroll container (the `overflow-x-auto` wrapper in Index.tsx).
     *  Used to re-center the horizontal scroll position when the showcase opens, so the
     *  leading cards — clipped by the `justify-center` row at rest — become reachable. */
    containerRef?: RefObject<HTMLDivElement>;
}

export const HeroShowcase = ({ containerRef }: HeroShowcaseProps = {}) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);
    const selectedCard = selected !== null ? CARDS[selected] : null;

    // On open, center the scroll position within the overflow so both the leading and
    // trailing cards (clipped at rest by justify-center) are reachable by scrolling in
    // either direction, instead of starting pinned at scrollLeft: 0. The cards spread out
    // via a staggered CSS transform transition rather than an instant layout change, so
    // scrollWidth doesn't reach its expanded value until that transition finishes — we
    // wait for it before measuring, otherwise we'd center against the still-stacked width.
    useEffect(() => {
        if (!open) return;
        const row = containerRef?.current;
        if (!row) return;
        const id = window.setTimeout(() => {
            row.scrollLeft = (row.scrollWidth - row.clientWidth) / 2;
        }, OPEN_ANIMATION_MS);
        return () => window.clearTimeout(id);
    }, [open, containerRef]);

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
                    const delay = open ? i * OPEN_STAGGER_MS : (CARDS.length - 1 - i) * CLOSE_STAGGER_MS;

                    return (
                        <div
                            key={card.label}
                            className="shrink-0 overflow-visible"
                            style={{
                                width: CARD_W,
                                transform: `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg)`,
                                transition: `transform ${CARD_TRANSITION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
                                zIndex: open ? 1 : 10 - Math.abs(i - 3),
                                position: "relative",
                            }}
                        >
                            <div
                                onClick={(e) => { e.stopPropagation(); setSelected(i); }}
                                className={cn(
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
                hover to explore, click for details
            </p>

            {/* Detail modal — shown when a card is clicked */}
            <Dialog open={selected !== null} onOpenChange={(v) => !v && setSelected(null)}>
                <DialogContent className="max-w-md" onClick={(e) => e.stopPropagation()}>
                    {selectedCard && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="font-display text-2xl">{selectedCard.label}</DialogTitle>
                                <DialogDescription className="text-primary font-semibold">
                                    {selectedCard.tagline}
                                </DialogDescription>
                            </DialogHeader>
                            <p className="text-sm text-muted-foreground leading-relaxed">{selectedCard.desc}</p>
                            <ul className="space-y-2">
                                {selectedCard.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button asChild variant="hero" className="mt-2">
                                <Link to="/login">{selectedCard.cta} <ArrowRight className="w-4 h-4" /></Link>
                            </Button>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
