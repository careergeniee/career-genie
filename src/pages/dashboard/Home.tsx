import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
    Bot, FileText, MessageSquare, Map, GraduationCap,
    ArrowRight, TrendingUp, Award, Brain, ClipboardList, Target,
    Check, Lock,
} from "lucide-react";
import genieLogo2 from "@/assets/genie-logo2.png";
import { Button } from "@/components/ui/button";
import { loadData } from "@/lib/userStore";
import { loadPrediction } from "@/lib/careerEngine";
import { totalProgress, phaseProgress } from "@/lib/roadmap";
import type { Roadmap } from "@/lib/roadmap";
import type { InterviewSession } from "@/lib/interview";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarTrend } from "@/components/dashboard/BarTrend";

const services = [
    { label: "Career Assessment", path: "/dashboard/assessment", icon: ClipboardList, active: true, desc: "Discover your best-fit careers" },
    { label: "Career Match", path: "/dashboard/careers", icon: Target, active: true, desc: "ML predictions & skill gaps" },
    { label: "AI Chatbot", path: "/dashboard/chat", icon: Bot, active: true, desc: "Chat with your AI career mentor" },
    { label: "Resume Builder", path: "/dashboard/resume", icon: FileText, active: true, desc: "Build ATS-friendly resumes" },
    { label: "Interview Prep", path: "/dashboard/interview", icon: MessageSquare, active: true, desc: "Practice mock interviews" },
    { label: "Roadmap", path: "/dashboard/roadmap", icon: Map, active: true, desc: "Personalized career paths" },
    { label: "Senior Instructor", path: "/dashboard/instructor", icon: GraduationCap, active: true, desc: "Daily tasks, quizzes & 1:1 mentorship" },
];

const DashboardHome = () => {
    const { user } = useAuth();
    const name = user?.displayName || user?.email?.split("@")[0] || "Explorer";

    const roadmap = loadData<Roadmap | null>("roadmap", null);
    const sessions = loadData<InterviewSession[]>("interview_sessions", []);
    const prediction = loadPrediction();

    const roadmapPct = roadmap ? Math.round(totalProgress(roadmap)) : null;
    const sessionCount = sessions.length;
    const lastScore = sessions[0]?.overallScore ?? null;
    const topCareer = prediction?.topCareer ?? null;

    // Phase breakdown bubbles — only when roadmap phases exist
    const phaseItems = roadmap
        ? roadmap.phases.slice(0, 4).map((p) => ({
              label: p.title.replace(/^Phase\s*\d+:?\s*/i, "").slice(0, 20) || p.title.slice(0, 20),
              value: Math.round(phaseProgress(p)),
          }))
        : [];

    // Score history bars — only finished sessions, oldest→newest for natural chart flow
    const scoreItems = sessions
        .filter((s) => s.finished)
        .slice(0, 8)
        .reverse()
        .map((s) => ({
            label: new Date(s.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
            value: s.overallScore,
        }));

    return (
        <div className="dash-bg min-h-screen">
            <div className="p-6 lg:p-10 max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full dash-card border border-border/60 text-xs font-medium mb-4">
                        <img src={genieLogo2} alt="" className="w-6 h-6 object-contain shrink-0" />
                        <span className="text-muted-foreground">Your career command center</span>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                        Welcome back, <span className="text-primary">{name}</span> 👋
                    </h1>
                    <p className="text-muted-foreground text-lg">What would you like to work on today?</p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        index={0}
                        icon={TrendingUp}
                        title="Roadmap progress"
                        value={roadmapPct !== null ? `${roadmapPct}%` : "—"}
                    />
                    <StatCard
                        index={1}
                        icon={Brain}
                        title="Interview sessions"
                        value={sessionCount}
                    />
                    <StatCard
                        index={2}
                        icon={Award}
                        title="Last score"
                        value={lastScore !== null ? `${lastScore}/100` : "—"}
                    />
                    <StatCard
                        index={3}
                        icon={Target}
                        title="Career match"
                        value={topCareer ?? "Not taken yet"}
                    />
                </div>

                {/* Current Focus — phase-by-phase list ala Stitch design */}
                {phaseItems.length > 0 && (
                    <div className="dash-card p-6 mb-6 animate-pop-in" style={{ animationDelay: "280ms" }}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="font-display font-bold text-lg">Current Focus</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">{roadmap!.goal}</p>
                            </div>
                            <span className="dash-pill">{roadmapPct}% overall</span>
                        </div>
                        <div className="space-y-3">
                            {phaseItems.map((item, i) => {
                                const done   = item.value === 100;
                                const active = item.value > 0 && item.value < 100;
                                const locked = item.value === 0;
                                return (
                                    <div
                                        key={item.label}
                                        className={`flex items-center gap-4 transition-opacity animate-pop-in${locked ? " opacity-50" : ""}`}
                                        style={{ animationDelay: `${280 + i * 55}ms` }}
                                    >
                                        {/* Status box */}
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
                                        {/* Label + status */}
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

                {/* Interview score trend — omitted when no finished sessions */}
                {scoreItems.length > 0 && (
                    <div className="dash-card-dark p-6 mb-8 animate-pop-in" style={{ animationDelay: "350ms" }}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="font-display font-bold text-lg text-white">Interview scores</h2>
                                <p className="text-xs text-white/50 mt-0.5">Most recent {scoreItems.length} completed sessions</p>
                            </div>
                            {lastScore !== null && (
                                <span className="dash-pill">Latest: {lastScore}/100</span>
                            )}
                        </div>
                        <BarTrend items={scoreItems} />
                    </div>
                )}

                {/* Tools grid */}
                <h2 className="font-display text-xl font-bold mb-5">Your Tools</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {services.map((s, i) => (
                        <Link
                            key={s.path}
                            to={s.active ? s.path : "#"}
                            style={{ animationDelay: `${i * 50}ms` }}
                            className={`dash-card-hover rounded-2xl p-6 block group animate-pop-in ${!s.active && "opacity-60 cursor-not-allowed"}`}
                        >
                            <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center mb-4 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
                                <s.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-display font-bold group-hover:text-primary transition-colors">{s.label}</h3>
                                {!s.active && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground font-medium">Soon</span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">{s.desc}</p>
                            {s.active && (
                                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    Open <ArrowRight className="w-3 h-3" />
                                </div>
                            )}
                        </Link>
                    ))}
                </div>

                {/* Assessment CTA */}
                <div className="dash-card rounded-2xl p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
                    <div className="relative">
                        <ClipboardList className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h3 className="font-display text-2xl font-bold mb-2">Start with your Career Assessment</h3>
                        <p className="text-muted-foreground mb-5">Answer a few questions and let the AI find careers that fit you.</p>
                        <Button asChild variant="hero" size="lg">
                            <Link to="/dashboard/assessment">Take the assessment <ArrowRight className="w-4 h-4" /></Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
