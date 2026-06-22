import { useEffect, useMemo, useRef, useState } from "react";
import {
    GraduationCap, AlarmClock, Brain, ClipboardCheck, MessageSquare,
    Loader2, Check, X, Flame, Send, RotateCcw, BellRing, Sparkles,
    CheckCircle2, XCircle, Trophy, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { todayKey } from "@/lib/userStore";
import {
    personaFor, buildUserContext, generateDailyTask, generateQuiz, reviewProgress,
    instructorChat, loadTasks, saveTasks, getTodayTask, taskStreak, missedTaskCount,
    loadChat, saveChat, loadReminderTime, saveReminderTime,
    type DailyTask, type QuizQuestion, type ProgressReview, type ChatMsg,
} from "@/lib/instructor";

type Tab = "daily" | "quiz" | "progress" | "mentor";

const signalUpdate = () => window.dispatchEvent(new Event("instructor:update"));

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

const Chip = ({ children }: { children: React.ReactNode }) => (
    <span className="text-xs px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium">
        {children}
    </span>
);

/* ===================== DAILY TASK ===================== */
const DailyTaskTab = ({ persona, ctx }: TabProps) => {
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

    // Auto-assign today's task the first time this tab opens.
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
            {/* Stats */}
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

            {/* Today's task */}
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
                            <button onClick={() => setDone(!today.done)} className="mt-0.5 shrink-0">
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
                    <button onClick={generate} className="text-sm text-primary font-medium">Assign today's task</button>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={generate} disabled={loading} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border/60 hover:bg-secondary/50 transition disabled:opacity-50">
                        <RotateCcw className="w-3.5 h-3.5" /> New task
                    </button>
                </div>
            </div>

            {/* Reminder settings */}
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
                    <button onClick={enableReminders} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-gold text-primary-foreground">
                        <BellRing className="w-3.5 h-3.5" /> Enable browser reminders
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ===================== QUIZ ===================== */
const QuizTab = ({ persona, ctx }: TabProps) => {
    const [topic, setTopic] = useState("");
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const suggestions = ctx.topics.slice(0, 8);

    const start = async (t: string) => {
        const chosen = t.trim();
        if (!chosen) return;
        setTopic(chosen);
        setLoading(true);
        setQuestions([]);
        setAnswers({});
        setSubmitted(false);
        try {
            const qs = await generateQuiz(chosen, persona, ctx);
            if (qs.length === 0) { toast.error("Couldn't build a quiz on that. Try another topic."); return; }
            setQuestions(qs);
        } catch {
            toast.error("Quiz generation failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const score = questions.reduce((s, q, i) => s + (answers[i] === q.answerIndex ? 1 : 0), 0);
    const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

    return (
        <div className="space-y-5">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" /> Test your knowledge
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    {persona.name} will quiz you on a topic from your field. Pick one or type your own.
                </p>
                {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {suggestions.map((s) => (
                            <button key={s} onClick={() => start(s)} disabled={loading}
                                className="text-xs px-3 py-1.5 rounded-full border border-border/60 bg-secondary/40 hover:border-primary/50 hover:text-foreground transition disabled:opacity-50">
                                {s}
                            </button>
                        ))}
                    </div>
                )}
                <div className="flex gap-2">
                    <input
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && start(topic)}
                        placeholder="…or type any topic (e.g. React hooks, SQL joins)"
                        className="flex-1 bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/60"
                    />
                    <button onClick={() => start(topic)} disabled={loading || !topic.trim()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-semibold disabled:opacity-50">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Quiz me
                    </button>
                </div>
            </div>

            {questions.length > 0 && (
                <div className="glass-card rounded-2xl p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold">Quiz: {topic}</h3>
                        {submitted && (
                            <span className={cn("text-sm font-bold px-3 py-1 rounded-full",
                                score === questions.length ? "bg-emerald-400/15 text-emerald-400" : score >= questions.length / 2 ? "bg-amber-400/15 text-amber-400" : "bg-rose-400/15 text-rose-400")}>
                                {score}/{questions.length}
                            </span>
                        )}
                    </div>

                    {questions.map((q, qi) => (
                        <div key={qi}>
                            <p className="font-medium text-sm mb-2">{qi + 1}. {q.question}</p>
                            <div className="space-y-1.5">
                                {q.options.map((opt, oi) => {
                                    const chosen = answers[qi] === oi;
                                    const correct = q.answerIndex === oi;
                                    const show = submitted;
                                    return (
                                        <button key={oi} disabled={submitted}
                                            onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                                            className={cn("w-full text-left text-sm px-3 py-2 rounded-lg border transition flex items-center gap-2",
                                                show && correct ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300" :
                                                show && chosen && !correct ? "border-rose-400/50 bg-rose-400/10 text-rose-300" :
                                                chosen ? "border-primary/60 bg-primary/10" : "border-border/60 hover:border-primary/40")}>
                                            {show && correct && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                                            {show && chosen && !correct && <XCircle className="w-4 h-4 shrink-0" />}
                                            <span>{opt}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {submitted && <p className="text-xs text-muted-foreground mt-2 pl-1">{q.explanation}</p>}
                        </div>
                    ))}

                    {!submitted ? (
                        <button onClick={() => setSubmitted(true)} disabled={!allAnswered}
                            className="w-full py-2.5 rounded-xl bg-gradient-gold text-primary-foreground font-semibold disabled:opacity-50">
                            {allAnswered ? "Submit answers" : "Answer all questions to submit"}
                        </button>
                    ) : (
                        <button onClick={() => start(topic)} className="w-full py-2.5 rounded-xl border border-border/60 font-medium hover:bg-secondary/50 transition">
                            Try another quiz
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

/* ===================== PROGRESS ===================== */
const ProgressTab = ({ persona, ctx }: TabProps) => {
    const [review, setReview] = useState<ProgressReview | null>(null);
    const [loading, setLoading] = useState(false);

    const run = async () => {
        setLoading(true);
        try {
            setReview(await reviewProgress(persona, ctx));
        } catch {
            toast.error("Review failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold mb-2 flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-primary" /> Progress review
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    {persona.name} reviews where you stand on your path to {ctx.career || "your career"} and tells you what to focus on next.
                </p>
                <button onClick={run} disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-semibold disabled:opacity-50">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Reviewing…</> : <><Sparkles className="w-4 h-4" /> Review my progress</>}
                </button>
            </div>

            {review && (
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center font-display text-xl font-bold text-primary-foreground">
                            {review.grade}
                        </div>
                        <p className="text-sm text-foreground/90 flex-1">{review.summary}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Doing well</p>
                            <ul className="space-y-1.5">
                                {review.doingWell.map((d, i) => <li key={i} className="text-sm text-muted-foreground">• {d}</li>)}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1.5"><ArrowRight className="w-4 h-4" /> Focus next</p>
                            <ul className="space-y-1.5">
                                {review.focusNext.map((d, i) => <li key={i} className="text-sm text-muted-foreground">• {d}</li>)}
                            </ul>
                        </div>
                    </div>
                    {review.nextMilestone && (
                        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary shrink-0" />
                            <p className="text-sm"><span className="font-semibold">Next milestone:</span> {review.nextMilestone}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ===================== MENTOR CHAT ===================== */
const STARTERS = [
    "What should I focus on this week?",
    "Am I ready to apply for jobs yet?",
    "What's the most common mistake people make in this field?",
];

const MentorTab = ({ persona, ctx }: TabProps) => {
    const [messages, setMessages] = useState<ChatMsg[]>(loadChat());
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => { saveChat(messages); endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const send = async (text: string) => {
        const content = text.trim();
        if (!content || loading) return;
        const history = [...messages, { role: "user" as const, content }];
        setMessages(history);
        setInput("");
        setLoading(true);
        try {
            const reply = await instructorChat(history, persona, ctx);
            setMessages([...history, { role: "assistant", content: reply || "…" }]);
        } catch {
            toast.error("Message failed. Try again.");
            setMessages(history);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card rounded-2xl p-6 flex flex-col h-[60vh]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {messages.length === 0 && (
                    <div className="text-center py-8">
                        <MessageSquare className="w-10 h-10 text-primary mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">Ask {persona.name} anything about your path.</p>
                        <div className="flex flex-col gap-2 max-w-sm mx-auto">
                            {STARTERS.map((s) => (
                                <button key={s} onClick={() => send(s)} className="text-sm text-left px-3 py-2 rounded-lg border border-border/60 bg-secondary/40 hover:border-primary/50 transition">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                            m.role === "user" ? "bg-gradient-gold text-primary-foreground" : "bg-secondary/60")}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-secondary/60 rounded-2xl px-4 py-2.5">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            <div className="flex gap-2 mt-4">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send(input)}
                    placeholder={`Message ${persona.name}…`}
                    className="flex-1 bg-secondary/50 border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60"
                />
                <button onClick={() => send(input)} disabled={loading || !input.trim()}
                    className="w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center text-primary-foreground disabled:opacity-50 shrink-0">
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

interface TabProps {
    persona: ReturnType<typeof personaFor>;
    ctx: ReturnType<typeof buildUserContext>;
}

export default InstructorPage;
