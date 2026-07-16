import { useState } from "react";
import { Brain, CheckCircle2, Loader2, Sparkles, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { generateQuiz, type QuizQuestion } from "@/lib/instructor";
import type { TabProps } from "./types";

export const QuizTab = ({ persona, ctx }: TabProps) => {
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
                <div className="flex gap-2 max-sm:flex-col">
                    <input
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && start(topic)}
                        placeholder="…or type any topic (e.g. React hooks, SQL joins)"
                        className="flex-1 bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/60"
                    />
                    <button onClick={() => start(topic)} disabled={loading || !topic.trim()}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-semibold disabled:opacity-50 max-sm:min-h-11">
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
