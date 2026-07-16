import { useEffect, useRef, useState } from "react";
import { AlarmClock, BellRing, CheckCircle2, Flame, Loader2, RotateCcw, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { todayKey } from "@/lib/userStore";
import {
    generateDailyTask, getTodayTask, loadReminderTime, loadTasks,
    missedTaskCount, saveReminderTime, saveTasks, taskStreak,
    type DailyTask,
} from "@/lib/instructor";
import type { TabProps } from "./types";

const signalUpdate = () => window.dispatchEvent(new Event("instructor:update"));

export const DailyTaskTab = ({ persona, ctx }: TabProps) => {
    const [tasks, setTasks] = useState<DailyTask[]>(loadTasks());
    const [loading, setLoading] = useState(false);
    const [reminderTime, setReminderTime] = useState(loadReminderTime());
    const generatedRef = useRef(false);

    const today = getTodayTask(tasks);
    const streak = taskStreak(tasks);
    const missed = missedTaskCount(tasks);

    const generate = async () => {
        setLoading(true);
        try {
            const task = await generateDailyTask(persona, ctx);
            const next = [...loadTasks().filter((t) => t.date !== todayKey()), task];
            saveTasks(next);
            setTasks(next);
            signalUpdate();
        } catch {
            toast.error("Could not assign a task. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!today && !generatedRef.current) {
            generatedRef.current = true;
            generate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setDone = (done: boolean) => {
        const next = loadTasks().map((t) =>
            t.date === todayKey() ? { ...t, done, completedAt: done ? Date.now() : undefined } : t
        );
        saveTasks(next);
        setTasks(next);
        signalUpdate();
        if (done) toast.success("Nice work — streak kept alive!");
    };

    const enableReminders = async () => {
        if (typeof Notification === "undefined") {
            toast.error("This browser doesn't support notifications.");
            return;
        }
        const p = await Notification.requestPermission();
        if (p === "granted") {
            new Notification("Career Genie reminders are on", {
                body: `I'll nudge you at ${reminderTime} if your task isn't done.`,
            });
            toast.success("Daily reminders enabled.");
        } else {
            toast.error("Notification permission was denied.");
        }
    };

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-2xl p-5">
                    <Flame className={cn("w-5 h-5 mb-2", streak > 0 ? "text-orange-400" : "text-muted-foreground")} />
                    <div className="font-display text-2xl font-bold">{streak}</div>
                    <div className="text-xs text-muted-foreground">Day streak</div>
                </div>
                <div className="glass-card rounded-2xl p-5">
                    <AlarmClock className={cn("w-5 h-5 mb-2", missed > 0 ? "text-rose-400" : "text-muted-foreground")} />
                    <div className="font-display text-2xl font-bold">{missed}</div>
                    <div className="text-xs text-muted-foreground">Missed tasks</div>
                </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold mb-3 flex items-center gap-2">
                    <AlarmClock className="w-4 h-4 text-primary" /> Today's assignment
                </h3>

                {loading ? (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                        <Loader2 className="w-4 h-4 animate-spin" /> {persona.name} is preparing your task…
                    </p>
                ) : today ? (
                    <div className={cn("rounded-xl border p-4", today.done ? "border-emerald-400/30 bg-emerald-400/5" : "border-amber-400/40 bg-amber-400/5")}>
                        <div className="flex items-start gap-3">
                            <button onClick={() => setDone(!today.done)} className="mt-0.5 shrink-0 max-sm:min-w-11 max-sm:min-h-11 max-sm:flex max-sm:items-center max-sm:justify-center">
                                {today.done ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <div className="w-6 h-6 rounded-full border-2 border-amber-400" />}
                            </button>
                            <div className="flex-1">
                                <p className={cn("font-medium", today.done && "line-through text-muted-foreground")}>{today.text}</p>
                                {today.why && <p className="text-sm text-muted-foreground mt-1">{today.why}</p>}
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">~{today.estMinutes} min</span>
                                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">{today.topic}</span>
                                </div>
                            </div>
                        </div>
                        {today.done && (
                            <p className="text-xs text-emerald-400 mt-3 flex items-center gap-1.5">
                                <Trophy className="w-3.5 h-3.5" /> Done for today. Come back tomorrow for the next one.
                            </p>
                        )}
                    </div>
                ) : (
                    <button onClick={generate} className="text-sm text-primary font-medium max-sm:inline-flex max-sm:items-center max-sm:min-h-11">Assign today's task</button>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                    <button
                        onClick={() => {
                            if (today?.done && !window.confirm("You've already completed today's task. Generate a new one anyway? This will reset today's progress.")) {
                                return;
                            }
                            generate();
                        }}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border/60 hover:bg-secondary/50 transition disabled:opacity-50 max-sm:min-h-11"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> New task
                    </button>
                </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold mb-1 flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-primary" /> Daily reminder
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Get an alarm-style nudge if you haven't done your task. A banner follows you across
                    the app, and (while it's open) a desktop notification fires at your chosen time.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm text-muted-foreground">Remind me at</label>
                    <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => { setReminderTime(e.target.value); saveReminderTime(e.target.value); }}
                        className="bg-secondary/50 border border-border/60 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary/60"
                    />
                    <button onClick={enableReminders} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-gold text-primary-foreground max-sm:min-h-11">
                        <BellRing className="w-3.5 h-3.5" /> Enable browser reminders
                    </button>
                </div>
            </div>
        </div>
    );
};
