import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AlarmClock, BellRing, ArrowRight, Check, X, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { todayKey, loadData, saveData } from "@/lib/userStore";
import {
    loadTasks, saveTasks, getTodayTask, loadReminderTime,
    loadLastNotified, saveLastNotified, buildUserContext, type DailyTask,
} from "@/lib/instructor";

const pad = (n: number) => String(n).padStart(2, "0");
const PROMPT_DISMISS_KEY = "instructorPromptDismissed";

/**
 * Lives in the dashboard layout. Two states:
 *   1. A pending task today  -> persistent ALARM banner (the accountability nudge).
 *   2. No task yet + a chosen career -> a soft prompt to get today's task.
 * Also fires a browser notification (while the app is open) at the user's
 * chosen reminder time if today's task is still undone.
 */
export const DailyTaskReminder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [tasks, setTasks] = useState<DailyTask[]>(loadTasks());
    const [promptDismissed, setPromptDismissed] = useState(
        loadData<string>(PROMPT_DISMISS_KEY, "") === todayKey()
    );

    // Re-read tasks on navigation and when the instructor page signals a change.
    useEffect(() => {
        const refresh = () => setTasks(loadTasks());
        refresh();
        window.addEventListener("instructor:update", refresh);
        return () => window.removeEventListener("instructor:update", refresh);
    }, [location.pathname]);

    // Browser notification scheduler (works while the app/tab is open).
    useEffect(() => {
        const check = () => {
            const t = getTodayTask(loadTasks());
            if (!t || t.done) return;
            if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
            const now = new Date();
            const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
            if (hhmm >= loadReminderTime() && loadLastNotified() !== todayKey()) {
                new Notification("Career Genie — today's task is waiting", {
                    body: t.text,
                    tag: "career-genie-daily",
                });
                saveLastNotified(todayKey());
            }
        };
        check();
        const id = window.setInterval(check, 60_000);
        return () => window.clearInterval(id);
    }, []);

    // Don't show on the instructor page itself.
    if (location.pathname.startsWith("/dashboard/instructor")) return null;

    const today = getTodayTask(tasks);
    const career = buildUserContext(user?.displayName || undefined).career;

    const markDone = () => {
        const next = loadTasks().map((t) =>
            t.date === todayKey() ? { ...t, done: true, completedAt: Date.now() } : t
        );
        saveTasks(next);
        setTasks(next);
        window.dispatchEvent(new Event("instructor:update"));
    };

    const dismissPrompt = () => {
        saveData(PROMPT_DISMISS_KEY, todayKey());
        setPromptDismissed(true);
    };

    // STATE 1 — pending task: persistent alarm.
    if (today && !today.done) {
        return (
            <div className="mx-4 mt-4 lg:mx-8 rounded-2xl border-2 border-amber-400/60 bg-amber-400/10 p-4 flex items-start gap-3 animate-pulse-slow">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center shrink-0">
                    <AlarmClock className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-sm text-amber-300">
                        Your senior instructor assigned a task today
                    </p>
                    <p className="text-sm text-foreground/90 mt-0.5">{today.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        ~{today.estMinutes} min · {today.topic}
                    </p>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={markDone}
                            className="relative inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-400 text-black hover:brightness-110 transition"
                        >
                            {/* Invisible hit-area extension, mobile-only — keeps the visible pill
                                compact while pushing the tappable box to the 44px guideline. */}
                            <span className="absolute inset-0 max-sm:-inset-2" aria-hidden="true" />
                            <Check className="w-3.5 h-3.5" /> Mark done
                        </button>
                        <button
                            onClick={() => navigate("/dashboard/instructor")}
                            className="relative inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-400/40 text-amber-300 hover:bg-amber-400/10 transition"
                        >
                            <span className="absolute inset-0 max-sm:-inset-2" aria-hidden="true" />
                            Open instructor <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
                <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
        );
    }

    // STATE 2 — no task yet but a career is chosen: soft prompt.
    if (!today && career && !promptDismissed) {
        return (
            <div className="mx-4 mt-4 lg:mx-8">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card/80 backdrop-blur-sm px-3.5 py-2 text-xs shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-muted-foreground">Today's task from your instructor is ready.</span>
                    <button
                        onClick={() => navigate("/dashboard/instructor")}
                        className="relative inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-glow transition-colors shrink-0"
                    >
                        {/* Invisible hit-area extension, mobile-only — this pill's text-only
                            button is far under 44px; keep its visible size but widen the tap box.
                            The right/inward side (facing "Dismiss", only ~12px away) is shrunk to
                            -5px instead of -16px so the two hit areas never bleed into each
                            other's visible box — see task-A17-report.md Fix Round 1. */}
                        <span className="absolute inset-0 max-sm:-inset-y-4 max-sm:-left-4 max-sm:-right-[5px]" aria-hidden="true" />
                        Get task <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                        onClick={dismissPrompt}
                        className="relative text-muted-foreground/60 hover:text-foreground shrink-0 ml-0.5"
                        aria-label="Dismiss"
                    >
                        {/* Left/inward side (facing "Get task") shrunk to -5px for the same
                            overlap-avoidance reason as above. */}
                        <span className="absolute inset-0 max-sm:-inset-y-4 max-sm:-right-4 max-sm:-left-[5px]" aria-hidden="true" />
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default DailyTaskReminder;
