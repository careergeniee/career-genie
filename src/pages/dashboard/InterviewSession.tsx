import { Loader2, Clock, ArrowLeft, CheckCircle2, Send, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { InterviewSession as Session } from "@/lib/interview";

interface InterviewSessionProps {
    session: Session;
    qIndex: number;
    answer: string;
    setAnswer: React.Dispatch<React.SetStateAction<string>>;
    listening: boolean;
    transcribing: boolean;
    timeLeft: number;
    evaluating: boolean;
    onSubmit: () => void;
    onToggleVoice: () => void;
    onStartVoice: () => void;
    onStopVoice: () => void;
    onQuit: () => void;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export const InterviewSession = ({
    session, qIndex, answer, setAnswer,
    listening, transcribing, timeLeft, evaluating,
    onSubmit, onToggleVoice, onStartVoice, onStopVoice, onQuit,
}: InterviewSessionProps) => {
    const progress = (qIndex / session.questions.length) * 100;
    const lowTime = timeLeft <= 20;

    return (
        <div className="min-h-screen p-6 lg:p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <button onClick={onQuit}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" /> Quit
                </button>
                <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold tabular-nums",
                    lowTime ? "bg-red-500/15 text-red-400 animate-pulse" : "bg-secondary text-foreground"
                )}>
                    <Clock className="w-4 h-4" /> {fmt(timeLeft)}
                </div>
            </div>

            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Question {qIndex + 1} of {session.questions.length}</span>
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
                {(listening || transcribing) && (
                    <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-red-400 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        {transcribing ? "Transcribing…" : "Listening…"}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                        {answer.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                    <button
                        onClick={onToggleVoice}
                        onPointerDown={(e) => {
                            if (e.pointerType === "touch") {
                                e.preventDefault();
                                if (!listening && !transcribing) onStartVoice();
                            }
                        }}
                        onPointerUp={(e) => { if (e.pointerType === "touch" && listening) onStopVoice(); }}
                        onPointerLeave={(e) => { if (e.pointerType === "touch" && listening) onStopVoice(); }}
                        onPointerCancel={(e) => { if (e.pointerType === "touch" && listening) onStopVoice(); }}
                        disabled={transcribing}
                        title={listening ? "Release to stop" : "Hold to speak (mobile) · Click to toggle (desktop)"}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all select-none",
                            listening
                                ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                                : transcribing
                                    ? "bg-secondary text-muted-foreground border border-border/60 opacity-60"
                                    : "bg-secondary text-muted-foreground hover:text-foreground border border-border/60"
                        )}>
                        {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        {listening ? "Stop" : transcribing ? "Processing…" : "Speak"}
                    </button>
                </div>
                <button onClick={onSubmit} disabled={evaluating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground font-semibold hover:shadow-[0_0_20px_hsl(48_96%_53%_/_0.5)] transition-all disabled:opacity-60">
                    {evaluating ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Evaluating...</>
                    ) : qIndex >= session.questions.length - 1 ? (
                        <><CheckCircle2 className="w-4 h-4" /> Finish</>
                    ) : (
                        <>Submit & next <Send className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </div>
    );
};
