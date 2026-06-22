import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Bot, FileText, MessageSquare, Map, GraduationCap, ArrowRight, TrendingUp, Award, Brain, ClipboardList, Target } from "lucide-react";
import genieLogo2 from "@/assets/genie-logo2.png";
import { Button } from "@/components/ui/button";
import { GlowOrbs } from "@/components/GlowOrbs";

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

    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

            <div className="relative p-6 lg:p-10 max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs font-medium mb-4">
                        <img src={genieLogo2} alt="" className="w-6 h-6 object-contain shrink-0" />
                        <span className="text-muted-foreground">Your career command center</span>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                        Welcome back, <span className="text-gradient-gold">{name}</span> 👋
                    </h1>
                    <p className="text-muted-foreground text-lg">What would you like to work on today?</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { icon: TrendingUp, label: "Goals hit", value: "0/5" },
                        { icon: Award, label: "Skills added", value: "0" },
                        { icon: Brain, label: "Interview score", value: "—" },
                    ].map((s) => (
                        <div key={s.label} className="glass-card rounded-2xl p-5 border border-border/60">
                            <s.icon className="w-5 h-5 text-primary mb-3" />
                            <div className="font-display text-2xl font-bold">{s.value}</div>
                            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Services Grid */}
                <h2 className="font-display text-xl font-bold mb-5">Your Tools</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((s) => (
                        <Link
                            key={s.path}
                            to={s.active ? s.path : "#"}
                            className={`glass-card-hover rounded-2xl p-6 block group transition-all ${!s.active && "opacity-60 cursor-not-allowed"}`}
                        >
                            <div className="relative w-12 h-12 mb-4">
                                <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all" />
                                <div className="relative w-full h-full rounded-xl bg-secondary border border-border flex items-center justify-center group-hover:border-primary/50 transition">
                                    <s.icon className="w-5 h-5 text-primary" />
                                </div>
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

                {/* CTA to assessment */}
                <div className="mt-10 glass-card rounded-2xl p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                    <div className="relative">
                        <ClipboardList className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h3 className="font-display text-2xl font-bold mb-2">Start with your Career Assessment</h3>
                        <p className="text-muted-foreground mb-5">Answer a few questions and let the ML model find careers that fit you.</p>
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