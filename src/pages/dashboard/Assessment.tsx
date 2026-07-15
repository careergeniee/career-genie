import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Brain, ArrowRight, ArrowLeft, Loader2, ClipboardList,
    CheckCircle2, Gauge,
} from "lucide-react";
import genieLogo2 from "@/assets/genie-logo2.png";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    PERSONALITY_QUESTIONS, SKILL_META, SKILL_CATEGORIES, SKILLS,
    type SkillKey,
} from "@/lib/mlSchema";
import {
    type Assessment, buildFeatures, predictCareers, emptySkillRatings,
    saveAssessment, savePrediction, loadAssessment,
    loadAssessmentDraft, saveAssessmentDraft, clearAssessmentDraft,
    warmMlService,
} from "@/lib/careerEngine";

const LIKERT = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];
const LEVELS = ["None", "Beginner", "Intermediate", "Advanced", "Expert"];

type Step = "intro" | "personality" | "skills";

const AssessmentPage = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>("intro");
    // A draft (saved as the user goes) takes priority over a prior *completed*
    // assessment — it's always the more recent state to resume from.
    const [answers, setAnswers] = useState<Record<string, number>>(
        () => loadAssessmentDraft()?.personalityAnswers ?? loadAssessment()?.personalityAnswers ?? {}
    );
    const [skills, setSkills] = useState<Record<SkillKey, number>>(
        () => loadAssessmentDraft()?.skillRatings ?? loadAssessment()?.skillRatings ?? emptySkillRatings()
    );
    // Tracks which skills the user has actually rated — skillRatings has every key
    // pre-filled with 0 by emptySkillRatings(), so "touched" can't be derived from
    // which keys are present in it and must be tracked separately.
    const [touchedSkills, setTouchedSkills] = useState<Set<SkillKey>>(() => {
        const draft = loadAssessmentDraft();
        if (draft) return new Set(draft.touchedSkillKeys);
        const saved = loadAssessment()?.skillRatings;
        if (!saved) return new Set();
        return new Set(SKILLS.filter((s) => s in saved));
    });
    const [loading, setLoading] = useState(false);

    // Wake a sleeping free-tier Render instance now, ~3 minutes before the
    // real predict call — cold starts can take longer than that call's own
    // timeout budget and would otherwise silently fall back to offline mode.
    useEffect(() => {
        warmMlService();
    }, []);

    const answeredCount = Object.keys(answers).length;
    const personalityDone = answeredCount === PERSONALITY_QUESTIONS.length;

    // Persist progress as the user answers, so a refresh or switching device/tab
    // mid-quiz doesn't lose it. Debounced since this fires on every click.
    useEffect(() => {
        if (answeredCount === 0 && touchedSkills.size === 0) return;
        const t = setTimeout(() => {
            saveAssessmentDraft({
                personalityAnswers: answers,
                skillRatings: skills,
                touchedSkillKeys: Array.from(touchedSkills),
            });
        }, 400);
        return () => clearTimeout(t);
    }, [answers, skills, touchedSkills, answeredCount]);

    const submit = async () => {
        if (!personalityDone) {
            toast.error("Please answer every personality statement.");
            setStep("personality");
            return;
        }
        // Skills are intentionally optional here — rate one, several, or none.
        // Anything left unrated defaults to "None" and the model predicts off
        // whatever was actually provided.
        setLoading(true);
        try {
            const assessment: Assessment = {
                personalityAnswers: answers,
                skillRatings: skills,
                completedAt: Date.now(),
            };
            const features = buildFeatures(assessment);
            const result = await predictCareers(features);
            saveAssessment(assessment);
            savePrediction(result);
            clearAssessmentDraft();
            toast.success("Career match ready");
            navigate("/dashboard/careers");
        } catch {
            toast.error("Could not generate your career match. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="relative p-6 lg:p-10 max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs font-medium mb-4">
                        <img src={genieLogo2} alt="" className="w-4 h-4 object-contain" />
                        <span className="text-muted-foreground">Career assessment</span>
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                        Find your <span className="text-gradient-gold">best-fit career</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Answer a short personality questionnaire and rate your skills. Our AI
                        predicts the careers that match you best.
                    </p>
                </div>

                {/* Stepper */}
                {step !== "intro" && (
                    <div className="flex items-center gap-3 mb-6 text-sm">
                        <span className={cn("flex items-center gap-1.5", step === "personality" ? "text-primary font-semibold" : "text-muted-foreground")}>
                            <Brain className="w-4 h-4" /> Personality
                        </span>
                        <span className="h-px flex-1 bg-border" />
                        <span className={cn("flex items-center gap-1.5", step === "skills" ? "text-primary font-semibold" : "text-muted-foreground")}>
                            <Gauge className="w-4 h-4" /> Skills
                        </span>
                    </div>
                )}

                {/* INTRO */}
                {step === "intro" && (
                    <div className="glass-card rounded-2xl p-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-gold mx-auto flex items-center justify-center mb-5 shadow-[0_0_30px_hsl(48_96%_53%_/_0.4)]">
                            <ClipboardList className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <h2 className="font-display text-2xl font-bold mb-2">Two quick steps</h2>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            12 personality statements and 15 skill ratings. Takes about 3
                            minutes. You can retake it anytime.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 mb-7 text-left">
                            <div className="rounded-xl border border-border/60 p-4">
                                <Brain className="w-5 h-5 text-primary mb-2" />
                                <p className="font-semibold text-sm">Personality</p>
                                <p className="text-xs text-muted-foreground">Leadership, creativity, analytical thinking & more.</p>
                            </div>
                            <div className="rounded-xl border border-border/60 p-4">
                                <Gauge className="w-5 h-5 text-primary mb-2" />
                                <p className="font-semibold text-sm">Skills</p>
                                <p className="text-xs text-muted-foreground">Rate your level across 15 technical & design skills.</p>
                            </div>
                        </div>
                        <Button variant="hero" size="lg" onClick={() => setStep("personality")}>
                            Start assessment <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* PERSONALITY */}
                {step === "personality" && (
                    <div className="space-y-4">
                        <Progress value={(answeredCount / PERSONALITY_QUESTIONS.length) * 100} className="h-1.5" />
                        {PERSONALITY_QUESTIONS.map((q, i) => (
                            <div key={q.id} className="glass-card rounded-xl p-5">
                                <p className="font-medium mb-3">
                                    <span className="text-primary mr-1.5">{i + 1}.</span>{q.text}
                                </p>
                                <div className="grid grid-cols-5 gap-2">
                                    {LIKERT.map((label, idx) => {
                                        const val = idx + 1;
                                        const active = answers[q.id] === val;
                                        return (
                                            <button
                                                key={val}
                                                onClick={() => setAnswers((a) => ({ ...a, [q.id]: val }))}
                                                className={cn(
                                                    "rounded-lg border px-1 py-2.5 text-[11px] leading-tight transition-all",
                                                    active
                                                        ? "border-primary bg-primary/15 text-primary font-semibold"
                                                        : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                                )}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between pt-2">
                            <Button variant="ghost" onClick={() => setStep("intro")}>
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Button>
                            <Button
                                variant="hero"
                                disabled={!personalityDone}
                                onClick={() => setStep("skills")}
                            >
                                Next: Skills <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* SKILLS */}
                {step === "skills" && (
                    <div className="space-y-5">
                        <p className="text-sm text-muted-foreground">
                            Rate your current level honestly — this drives your skill-gap analysis.
                            Rate as many or as few as apply; anything left blank counts as "None".
                        </p>
                        {SKILL_CATEGORIES.map((cat) => {
                            const inCat = SKILLS.filter((s) => SKILL_META[s].category === cat);
                            if (!inCat.length) return null;
                            return (
                                <div key={cat} className="glass-card rounded-xl p-5">
                                    <h3 className="font-display font-bold text-sm text-primary mb-4">{cat}</h3>
                                    <div className="space-y-4">
                                        {inCat.map((s) => (
                                            <div key={s} className="grid sm:grid-cols-[1fr_auto] gap-2 items-center">
                                                <span className="text-sm font-medium">{SKILL_META[s].label}</span>
                                                <div className="grid grid-cols-5 gap-1.5">
                                                    {LEVELS.map((label, idx) => {
                                                        const active = skills[s] === idx;
                                                        return (
                                                            <button
                                                                key={idx}
                                                                title={label}
                                                                onClick={() => {
                                                                    setSkills((p) => ({ ...p, [s]: idx }));
                                                                    setTouchedSkills((t) => new Set(t).add(s));
                                                                }}
                                                                className={cn(
                                                                    "rounded-md border px-2 py-1.5 text-[10px] transition-all",
                                                                    active
                                                                        ? "border-primary bg-primary/15 text-primary font-semibold"
                                                                        : "border-border/60 text-muted-foreground hover:border-primary/40"
                                                                )}
                                                            >
                                                                {label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        <div className="flex justify-between pt-2">
                            <Button variant="ghost" onClick={() => setStep("personality")}>
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Button>
                            <Button variant="hero" size="lg" disabled={loading} onClick={submit}>
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
                                ) : (
                                    <><CheckCircle2 className="w-4 h-4" /> Get my career match</>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssessmentPage;
