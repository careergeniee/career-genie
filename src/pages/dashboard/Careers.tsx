import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Sparkles, Target, ArrowRight, RefreshCw, Map, Loader2,
    CheckCircle2, AlertTriangle, XCircle, Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { aiText } from "@/lib/ai";
import { PERSONALITY, TRAIT_LABEL } from "@/lib/mlSchema";
import { CAREER_BLURB } from "@/lib/careerCatalog";
import {
    loadPrediction, loadAssessment, analyzeSkillGap, traitScore,
    strongSkillsText, type SkillGapItem,
} from "@/lib/careerEngine";

const STATUS_STYLE = {
    strong: { icon: CheckCircle2, cls: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10", label: "Strong" },
    developing: { icon: AlertTriangle, cls: "text-amber-400 border-amber-400/30 bg-amber-400/10", label: "Developing" },
    missing: { icon: XCircle, cls: "text-rose-400 border-rose-400/30 bg-rose-400/10", label: "Gap" },
} as const;

const CareersPage = () => {
    const navigate = useNavigate();
    const prediction = loadPrediction();
    const assessment = loadAssessment();

    const [selected, setSelected] = useState<string>(
        prediction?.topCareer ?? ""
    );
    const [explanations, setExplanations] = useState<Record<string, string>>({});
    const [explaining, setExplaining] = useState(false);

    // Top personality traits, for the AI prompt and the summary chips.
    const topTraits = assessment
        ? PERSONALITY
              .map((t) => ({ t, score: traitScore(t, assessment.personalityAnswers) }))
              .sort((a, b) => b.score - a.score)
        : [];

    const gap: SkillGapItem[] =
        selected && assessment ? analyzeSkillGap(selected, assessment.skillRatings) : [];

    // Generate an AI explanation the first time a career is selected.
    useEffect(() => {
        if (!selected || !assessment || explanations[selected]) return;
        let cancelled = false;
        (async () => {
            setExplaining(true);
            try {
                const traits = topTraits.slice(0, 3).map((x) => TRAIT_LABEL[x.t]).join(", ");
                const strengths = gap.filter((g) => g.status === "strong").map((g) => g.label);
                const gaps = gap.filter((g) => g.status !== "strong").map((g) => g.label);
                const text = await aiText(
                    "You are a concise, encouraging career counselor. 2-3 short sentences, no lists.",
                    `Explain why "${selected}" is a good fit for a student whose strongest traits are ${traits}. ` +
                        `They already have: ${strengths.join(", ") || "few of the core skills yet"}. ` +
                        `They still need to grow: ${gaps.join(", ") || "nothing major"}. ` +
                        `Be specific and motivating, address the student as "you".`,
                    { maxTokens: 220, temperature: 0.6 }
                );
                if (!cancelled) setExplanations((m) => ({ ...m, [selected]: text }));
            } catch {
                if (!cancelled)
                    setExplanations((m) => ({
                        ...m,
                        [selected]: CAREER_BLURB[selected] ?? "",
                    }));
            } finally {
                if (!cancelled) setExplaining(false);
            }
        })();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    // ---- Empty state -----------------------------------------------------
    if (!prediction || !assessment) {
        return (
            <div className="relative min-h-screen flex items-center justify-center p-6">
                <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
                <div className="glass-card rounded-2xl p-10 text-center max-w-md relative">
                    <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="font-display text-2xl font-bold mb-2">No career match yet</h2>
                    <p className="text-muted-foreground mb-6">
                        Take the quick assessment and our AI will predict the careers
                        that fit you best.
                    </p>
                    <Button variant="hero" size="lg" onClick={() => navigate("/dashboard/assessment")}>
                        Take the assessment <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        );
    }

    const buildRoadmap = () => {
        navigate("/dashboard/roadmap", {
            state: { goal: selected, skills: strongSkillsText(assessment.skillRatings) },
        });
    };

    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="relative p-6 lg:p-10 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                    <div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold mb-1">
                            Your <span className="text-gradient-gold">career matches</span>
                        </h1>
                        <p className="text-muted-foreground">
                            Ranked by how well your personality and skills fit each role.
                        </p>
                    </div>
                    <Button variant="ghost" onClick={() => navigate("/dashboard/assessment")}>
                        <RefreshCw className="w-4 h-4" /> Retake
                    </Button>
                </div>

                {/* Trait chips + confidence */}
                {topTraits.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        {topTraits.slice(0, 3).map((x) => (
                            <span key={x.t} className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium">
                                {TRAIT_LABEL[x.t]} · {Math.round(x.score * 100)}%
                            </span>
                        ))}
                        <span
                            className={cn(
                                "text-xs px-3 py-1.5 rounded-full border font-medium",
                                prediction.uncertain
                                    ? "border-amber-400/30 bg-amber-400/10 text-amber-400"
                                    : "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                            )}
                        >
                            {prediction.uncertain ? "Close call" : "Confident match"} · {Math.round(prediction.confidence * 100)}% margin
                        </span>
                    </div>
                )}
                {prediction.uncertain && (
                    <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
                        Your top matches are close together, so consider the top two or three roles rather than just the first. Adding more skills and retaking the assessment can sharpen the result.
                    </p>
                )}
                {!prediction.uncertain && <div className="mb-8" />}

                <div className="grid lg:grid-cols-[340px_1fr] gap-6">
                    {/* Ranked predictions */}
                    <div className="space-y-3">
                        {prediction.predictions.map((p, i) => {
                            const active = p.career === selected;
                            return (
                                <button
                                    key={p.career}
                                    onClick={() => setSelected(p.career)}
                                    className={cn(
                                        "w-full text-left rounded-xl p-4 border transition-all",
                                        active
                                            ? "border-primary/60 bg-primary/10 glow-gold"
                                            : "glass-card border-border/60 hover:border-primary/40"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="flex items-center gap-2 font-display font-bold text-sm">
                                            {i === 0 && <Sparkles className="w-4 h-4 text-primary" />}
                                            {p.career}
                                        </span>
                                        <span className={cn("text-sm font-bold", active ? "text-primary" : "text-muted-foreground")}>
                                            {Math.round(p.probability * 100)}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-gold transition-all"
                                            style={{ width: `${Math.round(p.probability * 100)}%` }}
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Detail panel */}
                    <div className="glass-card rounded-2xl p-6 lg:p-8">
                        <h2 className="font-display text-2xl font-bold mb-1">{selected}</h2>
                        <p className="text-muted-foreground text-sm mb-5">{CAREER_BLURB[selected]}</p>

                        {/* AI explanation */}
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6">
                            <div className="flex items-center gap-2 text-primary text-xs font-semibold mb-2">
                                <Lightbulb className="w-4 h-4" /> Why this fits you
                            </div>
                            {explaining && !explanations[selected] ? (
                                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Thinking it through…
                                </p>
                            ) : (
                                <p className="text-sm leading-relaxed">{explanations[selected]}</p>
                            )}
                        </div>

                        {/* Skill gap */}
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4 text-primary" />
                            <h3 className="font-display font-bold">Skill gap analysis</h3>
                        </div>
                        {gap.length === 0 ? (
                            <p className="text-sm text-muted-foreground mb-6">
                                No specific skill requirements mapped for this role.
                            </p>
                        ) : (
                            <div className="space-y-2.5 mb-6">
                                {gap.map((g) => {
                                    const S = STATUS_STYLE[g.status];
                                    return (
                                        <div key={g.skill} className="flex items-center gap-3">
                                            <span className={cn("flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md border shrink-0 w-[104px] justify-center", S.cls)}>
                                                <S.icon className="w-3.5 h-3.5" /> {S.label}
                                            </span>
                                            <span className="text-sm font-medium flex-1">{g.label}</span>
                                            <div className="w-28 h-1.5 rounded-full bg-secondary overflow-hidden relative shrink-0">
                                                <div className="absolute top-0 bottom-0 w-px bg-foreground/40" style={{ left: `${g.required * 100}%` }} title="target" />
                                                <div className="h-full rounded-full bg-gradient-gold" style={{ width: `${g.current * 100}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3 pt-2 border-t border-border/60">
                            <Button variant="hero" onClick={buildRoadmap}>
                                <Map className="w-4 h-4" /> Build my roadmap
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link to="/dashboard/chat">
                                    Ask the AI mentor <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareersPage;
