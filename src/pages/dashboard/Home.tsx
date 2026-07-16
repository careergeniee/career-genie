import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
    Bot, FileText, MessageSquare, Map, GraduationCap,
    ArrowRight, TrendingUp, Award, Brain, ClipboardList, Target,
    Check, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadData } from "@/lib/userStore";
import { loadPrediction } from "@/lib/careerEngine";
import { totalProgress, phaseProgress } from "@/lib/roadmap";
import type { Roadmap } from "@/lib/roadmap";
import type { InterviewSession } from "@/lib/interview";
import { BarTrend } from "@/components/dashboard/BarTrend";

const services = [
    { label: "Career Assessment", path: "/dashboard/assessment", icon: ClipboardList, active: true, desc: "Discover your best-fit careers" },
    { label: "Career Match",      path: "/dashboard/careers",    icon: Target,        active: true, desc: "ML predictions & skill gaps" },
    { label: "AI Chatbot",        path: "/dashboard/chat",       icon: Bot,           active: true, desc: "Chat with your AI career mentor" },
    { label: "Resume Builder",    path: "/dashboard/resume",     icon: FileText,      active: true, desc: "Build ATS-friendly resumes" },
    { label: "Interview Prep",    path: "/dashboard/interview",  icon: MessageSquare, active: true, desc: "Practice mock interviews" },
    { label: "Roadmap",           path: "/dashboard/roadmap",    icon: Map,           active: true, desc: "Personalized career paths" },
    { label: "Senior Instructor", path: "/dashboard/instructor", icon: GraduationCap, active: true, desc: "Daily tasks, quizzes & mentorship" },
];

const DashboardHome = () => {
    const { user } = useAuth();
    const name = user?.displayName || user?.email?.split("@")[0] || "Explorer";

    const roadmap   = loadData<Roadmap | null>("roadmap", null);
    const sessions  = loadData<InterviewSession[]>("interview_sessions", []);
    const prediction = loadPrediction();

    const roadmapPct    = roadmap ? Math.round(totalProgress(roadmap)) : null;
    const sessionCount  = sessions.length;
    const lastScore     = sessions[0]?.overallScore ?? null;
    const topCareer     = prediction?.topCareer ?? null;

    const phaseItems = roadmap
        ? roadmap.phases.slice(0, 4).map((p) => ({
              label: p.title.replace(/^Phase\s*\d+:?\s*/i, "").slice(0, 22) || p.title.slice(0, 22),
              value: Math.round(phaseProgress(p)),
          }))
        : [];

    const scoreItems = sessions
        .filter((s) => s.finished)
        .slice(0, 8)
        .reverse()
        .map((s) => ({
            label: new Date(s.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
            value: s.overallScore,
        }));

    return (
        <div className="min-h-screen">
            <div className="p-6 lg:p-10 max-w-6xl mx-auto">

                {/* ── GREETING ── */}
                <div className="mb-10">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium mb-3">
                        Your career command center
                    </p>
                    <h1
                        className="font-display font-bold leading-[1.0] tracking-[-0.03em] mb-2"
                        style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
                    >
                        Welcome, <span className="text-primary">{name}</span>
                    </h1>
                    <p className="text-muted-foreground">What would you like to work on today?</p>
                </div>

                {/* ── BENTO STAT GRID ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                    {/* Roadmap progress — 2× wide, big number */}
                    <div className="col-span-2 dash-card p-6 flex items-end justify-between animate-pop-in" style={{ animationDelay: "40ms" }}>
                        <div className="min-w-0">
                            <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground font-medium mb-3">Roadmap progress</p>
                            <p className="font-display font-bold leading-none text-foreground"
                               style={{ fontSize: "clamp(48px, 6vw, 72px)" }}>
                                {roadmapPct !== null ? `${roadmapPct}%` : "—"}
                            </p>
                            {roadmap && (
                                <p className="text-xs text-muted-foreground mt-2 truncate">{roadmap.goal}</p>
                            )}
                        </div>
                        <TrendingUp className="w-10 h-10 text-primary/20 shrink-0" />
                    </div>

                    {/* Interview sessions */}
                    <div className="dash-card p-6 animate-pop-in" style={{ animationDelay: "80ms" }}>
                        <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground font-medium mb-3">Sessions</p>
                        <p className="font-display font-bold text-5xl leading-none">{sessionCount}</p>
                        <div className="flex items-center gap-1 mt-2">
                            <Brain className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">interview</span>
                        </div>
                    </div>

                    {/* Last score */}
                    <div className="dash-card p-6 animate-pop-in" style={{ animationDelay: "120ms" }}>
                        <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground font-medium mb-3">Last score</p>
                        <p className="font-display font-bold text-5xl leading-none">
                            {lastScore !== null ? lastScore : "—"}
                        </p>
                        {lastScore !== null && (
                            <p className="text-[10px] text-muted-foreground mt-2">/100</p>
                        )}
                    </div>
                </div>

                {/* Career match — full-width pill when available */}
                {topCareer && (
                    <div className="dash-card px-6 py-4 mb-8 flex flex-col items-start gap-3 max-sm:gap-2 sm:flex-row sm:items-center sm:justify-between animate-pop-in" style={{ animationDelay: "160ms" }}>
                        <div className="flex items-center gap-3">
                            <Award className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground font-medium">Top career match</p>
                                <p className="font-display font-semibold text-lg leading-tight mt-0.5">{topCareer}</p>
                            </div>
                        </div>
                        <Link to="/dashboard/careers" className="text-xs text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all max-sm:min-h-11 max-sm:py-2">
                            View details <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                )}

                {/* ── CURRENT FOCUS + CHART — side by side ── */}
                {(phaseItems.length > 0 || scoreItems.length > 0) && (
                    <div className={`grid gap-6 mb-8 ${phaseItems.length > 0 && scoreItems.length > 0 ? "md:grid-cols-[1fr_1.6fr]" : "grid-cols-1"}`}>

                        {/* Current Focus phases */}
                        {phaseItems.length > 0 && (
                            <div className="dash-card p-6 animate-pop-in" style={{ animationDelay: "200ms" }}>
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h2 className="font-display font-bold text-base">Current Focus</h2>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{roadmap!.goal}</p>
                                    </div>
                                    <span className="dash-pill">{roadmapPct}%</span>
                                </div>
                                <div className="space-y-3">
                                    {phaseItems.map((item, i) => {
                                        const done   = item.value === 100;
                                        const active = item.value > 0 && item.value < 100;
                                        const locked = item.value === 0;
                                        return (
                                            <div
                                                key={item.label}
                                                className={`flex items-center gap-4 animate-pop-in${locked ? " opacity-50" : ""}`}
                                                style={{ animationDelay: `${200 + i * 55}ms` }}
                                            >
                                                <div className={[
                                                    "w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 font-display font-bold text-xs",
                                                    done   ? "bg-primary text-primary-foreground" : "",
                                                    active ? "border-2 border-primary text-primary bg-transparent" : "",
                                                    locked ? "bg-secondary border border-border text-muted-foreground" : "",
                                                ].join(" ")}>
                                                    {done   && <Check className="w-5 h-5" />}
                                                    {active && `${item.value}%`}
                                                    {locked && <Lock className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm leading-tight">{item.label}</p>
                                                    <p className={`text-xs mt-0.5 ${done ? "text-muted-foreground" : active ? "text-primary font-medium" : "text-muted-foreground"}`}>
                                                        {done ? "Completed" : active ? "In Progress" : "Locked"}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Interview score trend */}
                        {scoreItems.length > 0 && (
                            <div className="dash-card-dark p-6 animate-pop-in" style={{ animationDelay: "240ms" }}>
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h2 className="font-display font-bold text-base text-white">Interview scores</h2>
                                        <p className="text-[10px] text-white/40 mt-0.5">Last {scoreItems.length} completed sessions</p>
                                    </div>
                                    {lastScore !== null && (
                                        <span className="dash-pill">Latest: {lastScore}/100</span>
                                    )}
                                </div>
                                <BarTrend items={scoreItems} />
                            </div>
                        )}
                    </div>
                )}

                {/* ── TOOLS GRID ── */}
                <h2 className="font-display text-xl font-bold mb-5 tracking-tight">Your Tools</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
                    {services.map((s, i) => (
                        <Link
                            key={s.path}
                            to={s.active ? s.path : "#"}
                            style={{ animationDelay: `${i * 40}ms` }}
                            className={`dash-card-hover rounded-xl p-5 block group animate-pop-in ${!s.active && "opacity-60 cursor-not-allowed"}`}
                        >
                            <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4 group-hover:border-primary/40 group-hover:bg-primary/8 transition-all duration-200">
                                <s.icon className="w-4 h-4 text-primary" />
                            </div>
                            <p className="font-display font-bold text-sm group-hover:text-primary transition-colors mb-1">{s.label}</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{s.desc}</p>
                            {s.active && (
                                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-[0.08em] opacity-0 group-hover:opacity-100 transition-opacity">
                                    Open <ArrowRight className="w-2.5 h-2.5" />
                                </div>
                            )}
                        </Link>
                    ))}
                </div>

                {/* ── ASSESSMENT CTA ── */}
                <div className="bg-foreground rounded-2xl p-8 text-background relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.14em] text-background/40 font-medium mb-2">Get started</p>
                            <h3 className="font-display font-bold text-2xl text-background mb-1">Start with your Career Assessment</h3>
                            <p className="text-background/50 text-sm">Answer a few questions — let AI find careers that fit you.</p>
                        </div>
                        <Button asChild
                            className="shrink-0 bg-primary text-primary-foreground rounded-[10px] px-7 h-12 font-semibold shadow-[0_4px_14px_hsl(19_86%_40%_/_0.4)] hover:brightness-90">
                            <Link to="/dashboard/assessment">Take the assessment <ArrowRight className="w-4 h-4" /></Link>
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardHome;
