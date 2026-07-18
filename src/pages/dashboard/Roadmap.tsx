import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    Map, Loader2, Flame, CheckCircle2, Circle, ExternalLink,
    RotateCcw, Trophy, Target, Clock,
} from "lucide-react";
import genieLogo3 from "@/assets/genie-logo3.png";
import { cn } from "@/lib/utils";
import { loadData, saveData, removeData, todayKey } from "@/lib/userStore";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import {
    GOALS, Roadmap, generateRoadmap, phaseProgress, totalProgress, currentStreak,
} from "@/lib/roadmap";
import { TechStackPanel } from "@/components/roadmap/TechStackPanel";

const KEY = "roadmap";

const RoadmapPage = () => {
    const [roadmap, setRoadmap] = useState<Roadmap | null>(() =>
        loadData<Roadmap | null>(KEY, null)
    );

    // setup
    const [goal, setGoal] = useState(GOALS[0]);
    const [customGoal, setCustomGoal] = useState("");
    const [skills, setSkills] = useState("");
    const [loading, setLoading] = useState(false);

    // Prefill from "Build my roadmap" on the Career Match page.
    const location = useLocation();
    useEffect(() => {
        const seed = location.state as { goal?: string; skills?: string } | null;
        if (seed?.goal) {
            if (GOALS.includes(seed.goal)) setGoal(seed.goal);
            else setCustomGoal(seed.goal);
        }
        if (seed?.skills) setSkills(seed.skills);
         
    }, [location.state]);

    useEffect(() => {
        if (roadmap) {
            saveData(KEY, roadmap);
            // Lets DashboardLayout's sidebar streak widget refresh immediately
            // instead of only on some unrelated re-render.
            window.dispatchEvent(new Event("roadmap:update"));
        }
    }, [roadmap]);

    const effectiveGoal = (customGoal.trim() || goal).trim();

    const build = async () => {
        setLoading(true);
        try {
            const r = await generateRoadmap(effectiveGoal, skills);
            if (r.phases.length === 0) {
                toast.error("Could not build a roadmap. Try again.");
                return;
            }
            setRoadmap(r);
            toast.success("Your personalized roadmap is ready");
        } catch {
            toast.error("Couldn't generate your roadmap. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = (phaseId: string, taskId: string) => {
        setRoadmap((r) => {
            if (!r) return r;
            let nowComplete = false;
            const phases = r.phases.map((p) =>
                p.id !== phaseId
                    ? p
                    : {
                          ...p,
                          tasks: p.tasks.map((t) => {
                              if (t.id !== taskId) return t;
                              nowComplete = !t.done;
                              return { ...t, done: !t.done };
                          }),
                      }
            );
            // Log today's date for streaks only when checking a task ON.
            let completionDates = r.completionDates;
            if (nowComplete && !completionDates.includes(todayKey())) {
                completionDates = [...completionDates, todayKey()];
            }
            return { ...r, phases, completionDates };
        });
    };

    const reset = () => {
        toast("Delete this roadmap?", {
            description: "Your progress will be lost and you'll start over.",
            action: {
                label: "Yes, delete",
                onClick: () => {
                    removeData(KEY);
                    setRoadmap(null);
                },
            },
            cancel: { label: "Cancel", onClick: () => {} },
        });
    };

    /* ================= SETUP ================= */
    if (!roadmap) {
        return (
            <div className="min-h-screen p-6 lg:p-8 max-w-3xl mx-auto">
                <Header />

                <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-display font-bold mb-4">Generate your roadmap</h3>

                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Career goal
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2 mb-3">
                        {GOALS.map((g) => (
                            <button
                                key={g}
                                onClick={() => {
                                    setGoal(g);
                                    setCustomGoal("");
                                }}
                                className={cn(
                                    "text-left text-sm px-3 py-2 max-sm:py-3 rounded-lg border transition-all",
                                    goal === g && !customGoal
                                        ? "border-primary/60 bg-primary/10 text-foreground"
                                        : "border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                    <input
                        className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/60 mb-5"
                        placeholder="…or type a custom goal"
                        value={customGoal}
                        onChange={(e) => setCustomGoal(e.target.value)}
                    />

                    <TechStackPanel goal={effectiveGoal} skills={skills} />

                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Your current skills (for personalization)
                    </label>
                    <textarea
                        className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/60 min-h-[80px] resize-y mb-5"
                        placeholder="e.g. I know HTML, CSS and basic JavaScript. New to React and backend."
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                    />

                    <button
                        onClick={build}
                        disabled={loading}
                        className="w-full flex items-start justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-gold text-primary-foreground font-semibold hover:shadow-[0_0_24px_hsl(48_96%_53%_/_0.5)] transition-all disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 shrink-0 mt-0.5 animate-spin" />
                                <span className="min-w-0 text-center">Building your roadmap...</span>
                            </>
                        ) : (
                            <>
                                <img src={genieLogo3} alt="" className="w-4 h-4 object-contain shrink-0 mt-0.5" />
                                <span className="min-w-0 text-center">Generate roadmap for {effectiveGoal}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    /* ================= ROADMAP VIEW ================= */
    const total = totalProgress(roadmap);
    const streak = currentStreak(roadmap.completionDates);
    const totalWeeks = roadmap.phases.reduce((s, p) => s + p.weeks, 0);

    return (
        <div className="min-h-screen p-6 lg:p-8 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <Header goal={roadmap.goal} />
                <button
                    onClick={reset}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
                >
                    <RotateCcw className="w-4 h-4" /> New roadmap
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="glass-card rounded-2xl p-5">
                    <Target className="w-5 h-5 text-primary mb-2" />
                    <div className="font-display text-2xl font-bold">{total}%</div>
                    <div className="text-xs text-muted-foreground">Overall progress</div>
                </div>
                <div className="glass-card rounded-2xl p-5">
                    <Flame className={cn("w-5 h-5 mb-2", streak > 0 ? "text-orange-400" : "text-muted-foreground")} />
                    <div className="font-display text-2xl font-bold">
                        {streak} <span className="text-sm font-normal text-muted-foreground">day{streak === 1 ? "" : "s"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Current streak</div>
                </div>
                <div className="glass-card rounded-2xl p-5">
                    <Clock className="w-5 h-5 text-primary mb-2" />
                    <div className="font-display text-2xl font-bold">{totalWeeks}</div>
                    <div className="text-xs text-muted-foreground">Weeks planned</div>
                </div>
            </div>

            <TechStackPanel goal={roadmap.goal} skills={roadmap.currentSkills} stack={roadmap.techStack} />

            {total === 100 && (
                <div className="glass-card rounded-2xl p-5 mb-8 flex items-center gap-3 border border-primary/40">
                    <Trophy className="w-6 h-6 text-primary shrink-0" />
                    <p className="text-sm">
                        <span className="font-bold">Roadmap complete!</span> You finished every task
                        for {roadmap.goal}. Time to update that resume.
                    </p>
                </div>
            )}

            {/* Timeline */}
            <div className="relative">
                {/* vertical line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border/60" />

                <div className="space-y-6">
                    {roadmap.phases.map((phase, i) => {
                        const pct = phaseProgress(phase);
                        const complete = pct === 100;
                        return (
                            <div key={phase.id} className="relative pl-14">
                                {/* node */}
                                <div
                                    className={cn(
                                        "absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm border-2 z-10",
                                        complete
                                            ? "bg-gradient-gold text-primary-foreground border-primary"
                                            : pct > 0
                                            ? "bg-primary/15 text-primary border-primary/50"
                                            : "bg-secondary text-muted-foreground border-border"
                                    )}
                                >
                                    {complete ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                                </div>

                                <div className="glass-card rounded-2xl p-5">
                                    <div className="flex items-start justify-between gap-3 mb-1">
                                        <h3 className="font-display font-bold">{phase.title}</h3>
                                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground shrink-0">
                                            {phase.weeks} week{phase.weeks === 1 ? "" : "s"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">{phase.summary}</p>

                                    <div className="flex items-center gap-3 mb-4">
                                        <Progress value={pct} className="h-1.5 flex-1" />
                                        <span className="text-xs font-medium text-muted-foreground w-9 text-right">
                                            {pct}%
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {phase.tasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-secondary/30 transition-colors group"
                                            >
                                                <button
                                                    onClick={() => toggleTask(phase.id, task.id)}
                                                    className="shrink-0 mt-0.5 max-sm:mt-0 max-sm:w-11 max-sm:h-11 max-sm:flex max-sm:items-center max-sm:justify-center"
                                                >
                                                    {task.done ? (
                                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                                                    )}
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className={cn(
                                                            "text-sm leading-snug",
                                                            task.done && "line-through text-muted-foreground"
                                                        )}
                                                    >
                                                        {task.text}
                                                    </p>
                                                    {task.resourceUrl && (
                                                        <a
                                                            href={task.resourceUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-glow mt-1"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            {task.resourceLabel || "Resource"}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const Header = ({ goal }: { goal?: string }) => (
    <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center shadow-[0_0_20px_hsl(48_96%_53%_/_0.4)]">
            <Map className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
            <h1 className="font-display text-2xl font-bold">Career Roadmap</h1>
            <p className="text-sm text-muted-foreground">
                {goal ? `Path to ${goal}` : "AI-personalized path with progress tracking & streaks"}
            </p>
        </div>
    </div>
);

export default RoadmapPage;
