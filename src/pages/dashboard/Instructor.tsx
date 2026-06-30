import { useMemo, useState } from "react";
import { AlarmClock, Brain, ClipboardCheck, GraduationCap, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { buildUserContext, personaFor } from "@/lib/instructor";
import { Chip } from "./instructor/types";
import { DailyTaskTab } from "./instructor/DailyTaskTab";
import { QuizTab } from "./instructor/QuizTab";
import { ProgressTab } from "./instructor/ProgressTab";
import { MentorTab } from "./instructor/MentorTab";

type Tab = "daily" | "quiz" | "progress" | "mentor";

const InstructorPage = () => {
    const { user } = useAuth();
    const ctx = useMemo(() => buildUserContext(user?.displayName || undefined), [user]);
    const persona = useMemo(() => personaFor(ctx.career), [ctx.career]);
    const [tab, setTab] = useState<Tab>("daily");

    const tabs: { id: Tab; label: string; icon: typeof Brain }[] = [
        { id: "daily", label: "Daily Task", icon: AlarmClock },
        { id: "quiz", label: "Skill Quiz", icon: Brain },
        { id: "progress", label: "Progress Review", icon: ClipboardCheck },
        { id: "mentor", label: "Mentor Chat", icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Persona header */}
            <div className="glass-card rounded-2xl p-6 mb-6 flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center shrink-0 shadow-[0_0_24px_hsl(48_96%_53%_/_0.4)]">
                    <GraduationCap className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="font-display text-2xl font-bold">{persona.name}</h1>
                    <p className="text-sm text-primary font-medium">{persona.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{persona.tagline}</p>
                    {ctx.career ? (
                        <div className="flex flex-wrap gap-2 mt-3">
                            <Chip>Mentoring you toward {ctx.career}</Chip>
                            {ctx.roadmapProgress !== null && <Chip>{ctx.roadmapProgress}% roadmap done</Chip>}
                        </div>
                    ) : (
                        <p className="text-xs text-amber-400 mt-3">
                            Tip: take the Career Assessment so your instructor can tailor everything to you.
                        </p>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                            tab === t.id
                                ? "bg-gradient-gold text-primary-foreground"
                                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <t.icon className="w-4 h-4" /> {t.label}
                    </button>
                ))}
            </div>

            {tab === "daily" && <DailyTaskTab persona={persona} ctx={ctx} />}
            {tab === "quiz" && <QuizTab persona={persona} ctx={ctx} />}
            {tab === "progress" && <ProgressTab persona={persona} ctx={ctx} />}
            {tab === "mentor" && <MentorTab persona={persona} ctx={ctx} />}
        </div>
    );
};

export default InstructorPage;
