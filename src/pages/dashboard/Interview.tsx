import { useState, useEffect, useRef, useCallback } from "react";
import {
    MessageSquare, Sparkles, Loader2, Clock, ChevronRight, Play,
    History, Trophy, ArrowLeft, CheckCircle2, RotateCcw, Trash2, Send, Mic, MicOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { loadData, saveData } from "@/lib/userStore";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import {
    ROLES, DIFFICULTIES, Difficulty, InterviewSession, Answer,
    generateQuestions, evaluateAnswer, newSession,
} from "@/lib/interview";

const SECONDS_PER_Q = 120; // 2 minutes per answer
const KEY = "interview_sessions";

type View = "setup" | "active" | "result" | "review";

const InterviewPage = () => {
    const [view, setView] = useState<View>("setup");
    const [sessions, setSessions] = useState<InterviewSession[]>(() =>
        loadData<InterviewSession[]>(KEY, [])
    );

    // setup
    const [role, setRole] = useState(ROLES[0]);
    const [customRole, setCustomRole] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty>("entry");
    const [starting, setStarting] = useState(false);

    // active session
    const [session, setSession] = useState<InterviewSession | null>(null);
    const [qIndex, setQIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [evaluating, setEvaluating] = useState(false);
    const [timeLeft, setTimeLeft] = useState(SECONDS_PER_Q);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // review (a finished past session)
    const [reviewing, setReviewing] = useState<InterviewSession | null>(null);

    // voice input
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const voiceSupported = typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

    const toggleVoice = useCallback(() => {
        if (!voiceSupported) {
            toast.error("Voice input is not supported in this browser. Use Chrome or Edge.");
            return;
        }
        if (listening) {
            recognitionRef.current?.stop();
            return;
        }
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SR();
        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.continuous = true;
        recognitionRef.current = recognition;

        let interim = "";
        recognition.onresult = (event: any) => {
            let final = "";
            interim = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                if (event.results[i].isFinal) final += t + " ";
                else interim += t;
            }
            if (final) setAnswer((prev) => prev + final);
        };
        recognition.onerror = () => { setListening(false); };
        recognition.onend = () => { setListening(false); };
        recognition.start();
        setListening(true);
    }, [listening, voiceSupported]);

    useEffect(() => saveData(KEY, sessions), [sessions]);

    /* ---------- timer ---------- */
    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        stopTimer();
        setTimeLeft(SECONDS_PER_Q);
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    stopTimer();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    }, [stopTimer]);

    useEffect(() => () => stopTimer(), [stopTimer]);

    /* ---------- flow ---------- */
    const effectiveRole = (customRole.trim() || role).trim();

    const startInterview = async () => {
        setStarting(true);
        try {
            const qs = await generateQuestions(effectiveRole, difficulty);
            if (qs.length === 0) {
                toast.error("Could not generate questions. Try again.");
                return;
            }
            const s = newSession(effectiveRole, difficulty, qs);
            setSession(s);
            setQIndex(0);
            setAnswer("");
            setView("active");
            startTimer();
        } catch {
            toast.error("AI request failed. Check your API key and try again.");
        } finally {
            setStarting(false);
        }
    };

    const submitAnswer = async () => {
        if (!session || evaluating) return;
        setEvaluating(true);
        stopTimer();
        const timeUsed = SECONDS_PER_Q - timeLeft;
        const question = session.questions[qIndex];
        try {
            const evald = await evaluateAnswer(session.role, session.difficulty, question, answer);
            const ans: Answer = { question, answer, timeUsed, ...evald };
            const updated: InterviewSession = {
                ...session,
                answers: [...session.answers, ans],
            };
            setSession(updated);

            const isLast = qIndex >= session.questions.length - 1;
            if (isLast) {
                finishSession(updated);
            } else {
                setQIndex((i) => i + 1);
                setAnswer("");
                startTimer();
            }
        } catch {
            toast.error("Could not evaluate the answer. Try submitting again.");
        } finally {
            setEvaluating(false);
        }
    };

    const finishSession = (s: InterviewSession) => {
        const total = s.answers.reduce((sum, a) => sum + a.score, 0);
        const overall = Math.round((total / (s.answers.length * 10)) * 100);
        const finished: InterviewSession = { ...s, overallScore: overall, finished: true };
        setSession(finished);
        setSessions((prev) => [finished, ...prev]);
        setView("result");
        stopTimer();
    };

    const quitToSetup = () => {
        stopTimer();
        setSession(null);
        setView("setup");
    };

    const deleteSession = (id: string) =>
        setSessions((prev) => prev.filter((s) => s.id !== id));

    const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    const scoreColor = (pct: number) =>
        pct >= 75 ? "text-green-400" : pct >= 50 ? "text-primary" : "text-red-400";

    /* ================= SETUP ================= */
    if (view === "setup") {
        return (
            <div className="min-h-screen p-6 lg:p-8 max-w-4xl mx-auto">
                <Header />

                <div className="glass-card rounded-2xl p-6 mb-6">
                    <h3 className="font-display font-bold mb-4">Start a mock interview</h3>

                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Job role
                    </label>
                    <div className="grid sm:grid-cols-3 gap-2 mb-3">
                        {ROLES.map((r) => (
                            <button
                                key={r}
                                onClick={() => {
                                    setRole(r);
                                    setCustomRole("");
                                }}
                                className={cn(
                                    "text-left text-sm px-3 py-2 rounded-lg border transition-all",
                                    role === r && !customRole
                                        ? "border-primary/60 bg-primary/10 text-foreground"
                                        : "border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    <input
                        className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/60 mb-5"
                        placeholder="…or type a custom role"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                    />

                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Difficulty
                    </label>
                    <div className="flex gap-2 mb-6">
                        {DIFFICULTIES.map((d) => (
                            <button
                                key={d.id}
                                onClick={() => setDifficulty(d.id)}
                                className={cn(
                                    "flex-1 text-sm px-3 py-2 rounded-lg border transition-all",
                                    difficulty === d.id
                                        ? "border-primary/60 bg-primary/10"
                                        : "border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>10 questions · {fmt(SECONDS_PER_Q)} per answer · AI scored</span>
                    </div>

                    <button
                        onClick={startInterview}
                        disabled={starting}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-gold text-primary-foreground font-semibold hover:shadow-[0_0_24px_hsl(48_96%_53%_/_0.5)] transition-all disabled:opacity-60"
                    >
                        {starting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Generating questions...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" /> Start interview as {effectiveRole}
                            </>
                        )}
                    </button>
                </div>

                {/* Past sessions */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <History className="w-4 h-4 text-primary" />
                        <h3 className="font-display font-bold">Past sessions</h3>
                    </div>
                    {sessions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No sessions yet. Finish an interview to see it here.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {sessions.map((s) => (
                                <div
                                    key={s.id}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-secondary/20 hover:bg-secondary/40 transition-colors"
                                >
                                    <div
                                        className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg shrink-0 bg-secondary",
                                            scoreColor(s.overallScore)
                                        )}
                                    >
                                        {s.overallScore}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{s.role}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {DIFFICULTIES.find((d) => d.id === s.difficulty)?.label} ·{" "}
                                            {new Date(s.date).toLocaleDateString()} ·{" "}
                                            {s.answers.length} answers
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setReviewing(s);
                                            setView("review");
                                        }}
                                        className="text-xs font-medium text-primary hover:text-primary-glow flex items-center gap-1"
                                    >
                                        Review <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => deleteSession(s.id)}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* ================= ACTIVE ================= */
    if (view === "active" && session) {
        const progress = ((qIndex) / session.questions.length) * 100;
        const lowTime = timeLeft <= 20;
        return (
            <div className="min-h-screen p-6 lg:p-8 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={quitToSetup}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" /> Quit
                    </button>
                    <div
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold tabular-nums",
                            lowTime ? "bg-red-500/15 text-red-400 animate-pulse" : "bg-secondary text-foreground"
                        )}
                    >
                        <Clock className="w-4 h-4" /> {fmt(timeLeft)}
                    </div>
                </div>

                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        Question {qIndex + 1} of {session.questions.length}
                    </span>
                    <span>{session.role}</span>
                </div>
                <Progress value={progress} className="h-1.5 mb-6" />

                <div className="glass-card rounded-2xl p-6 mb-4">
                    <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-2">
                        Question {qIndex + 1}
                    </p>
                    <h2 className="font-display text-xl font-bold leading-snug">
                        {session.questions[qIndex]}
                    </h2>
                </div>

                <div className="relative">
                    <textarea
                        autoFocus
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here — or use the mic to speak. Be specific and structured (situation, action, result)."
                        className="w-full min-h-[180px] bg-secondary/40 border border-border/60 rounded-2xl p-4 text-sm outline-none focus:border-primary/60 resize-y leading-relaxed"
                    />
                    {listening && (
                        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-red-400 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-red-400" /> Listening…
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                            {answer.trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                        {voiceSupported && (
                            <button
                                onClick={toggleVoice}
                                title={listening ? "Stop recording" : "Speak your answer"}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    listening
                                        ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                                        : "bg-secondary text-muted-foreground hover:text-foreground border border-border/60"
                                )}
                            >
                                {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                                {listening ? "Stop" : "Speak"}
                            </button>
                        )}
                    </div>
                    <button
                        onClick={submitAnswer}
                        disabled={evaluating}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground font-semibold hover:shadow-[0_0_20px_hsl(48_96%_53%_/_0.5)] transition-all disabled:opacity-60"
                    >
                        {evaluating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Evaluating...
                            </>
                        ) : qIndex >= session.questions.length - 1 ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" /> Finish
                            </>
                        ) : (
                            <>
                                Submit & next <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    /* ============ RESULT / REVIEW ============ */
    const shown = view === "review" ? reviewing : session;
    if ((view === "result" || view === "review") && shown) {
        return (
            <div className="min-h-screen p-6 lg:p-8 max-w-3xl mx-auto">
                <button
                    onClick={quitToSetup}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to setup
                </button>

                <div className="glass-card rounded-2xl p-6 mb-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                    <div className="relative">
                        <Trophy className="w-9 h-9 text-primary mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-1">
                            {shown.role} · {DIFFICULTIES.find((d) => d.id === shown.difficulty)?.label}
                        </p>
                        <div className={cn("font-display text-5xl font-bold", scoreColor(shown.overallScore))}>
                            {shown.overallScore}
                            <span className="text-2xl text-muted-foreground">/100</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            {shown.answers.length} questions answered
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {shown.answers.map((a, i) => (
                        <div key={i} className="glass-card rounded-2xl p-5">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                    <p className="text-xs text-primary font-semibold mb-1">
                                        Question {i + 1}
                                    </p>
                                    <p className="font-display font-bold text-sm leading-snug">
                                        {a.question}
                                    </p>
                                </div>
                                <div
                                    className={cn(
                                        "shrink-0 font-display font-bold text-lg",
                                        a.score >= 7 ? "text-green-400" : a.score >= 4 ? "text-primary" : "text-red-400"
                                    )}
                                >
                                    {a.score}/10
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground mb-3 p-3 rounded-lg bg-secondary/30 border border-border/40">
                                <span className="text-foreground/70 font-medium">Your answer: </span>
                                {a.answer || <span className="italic">(no answer)</span>}
                            </div>

                            <p className="text-sm text-foreground/90 mb-2">
                                <span className="font-semibold text-primary">Feedback: </span>
                                {a.feedback}
                            </p>

                            {a.idealPoints.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                                        A strong answer covers:
                                    </p>
                                    <ul className="space-y-0.5">
                                        {a.idealPoints.map((p, j) => (
                                            <li key={j} className="text-xs text-muted-foreground pl-3">
                                                • {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <p className="text-[11px] text-muted-foreground/70 mt-3 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {fmt(a.timeUsed)} used
                            </p>
                        </div>
                    ))}
                </div>

                <button
                    onClick={quitToSetup}
                    className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary hover:bg-secondary/80 font-medium transition-colors"
                >
                    <RotateCcw className="w-4 h-4" /> New interview
                </button>
            </div>
        );
    }

    return null;
};

const Header = () => (
    <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center shadow-[0_0_20px_hsl(48_96%_53%_/_0.4)]">
            <MessageSquare className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
            <h1 className="font-display text-2xl font-bold">Interview Prep</h1>
            <p className="text-sm text-muted-foreground">
                AI mock interviews with per-answer timing and instant scoring
            </p>
        </div>
    </div>
);

export default InterviewPage;
