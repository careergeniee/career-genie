import { useState, useEffect, useRef } from "react";
import { FileText, Download, Sparkles, Loader2, RotateCcw } from "lucide-react";
import { aiText } from "@/lib/ai";
import { useAuth } from "@/contexts/AuthContext";
import { loadData, saveData } from "@/lib/userStore";
import { ResumeData, TemplateId, AtsResult, emptyResume, sampleResume, scoreResume } from "@/lib/resume";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { ResumeForm } from "./ResumeForm";
import { toast } from "sonner";

const KEY = "resume";

const ResumePage = () => {
    const { user } = useAuth();
    const [data, setData] = useState<ResumeData>(() => loadData<ResumeData>(KEY, sampleResume()));
    const [template, setTemplate] = useState<TemplateId>(() => loadData<TemplateId>("resume_tpl", "modern"));
    const [downloading, setDownloading] = useState(false);
    const [targetRole, setTargetRole] = useState(() => loadData("resume_role", ""));
    const [ats, setAts] = useState<AtsResult | null>(null);
    const [scoring, setScoring] = useState(false);
    const [rewritingId, setRewritingId] = useState<string | null>(null);

    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => saveData(KEY, data), 400);
        return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
    }, [data]);
    useEffect(() => saveData("resume_tpl", template), [template]);
    useEffect(() => saveData("resume_role", targetRole), [targetRole]);

    const rewriteBullets = async (expId: string) => {
        const exp = data.experience.find((e) => e.id === expId);
        if (!exp?.bullets.trim()) {
            toast.error("Add some bullet points first, then I can improve them.");
            return;
        }
        setRewritingId(expId);
        try {
            const improved = await aiText(
                "You are an expert resume writer. Rewrite the provided job bullet points to be more impactful, ATS-friendly, and achievement-focused. Use strong action verbs and quantify results where possible. Return ONLY the rewritten bullet points, one per line, no extra commentary.",
                `Role: ${exp.role || "professional"}\nCompany: ${exp.company || "a company"}\n\nCurrent bullets:\n${exp.bullets}`
            );
            setData((d) => ({
                ...d,
                experience: d.experience.map((e) =>
                    e.id === expId ? { ...e, bullets: improved } : e
                ),
            }));
            toast.success("Bullets rewritten with AI!");
        } catch {
            toast.error("AI rewrite failed. Try again.");
        } finally {
            setRewritingId(null);
        }
    };

    const downloadPdf = async () => {
        setDownloading(true);
        try {
            const [{ pdf }, { ResumePDF }] = await Promise.all([
                import("@react-pdf/renderer"),
                import("@/components/resume/ResumePDF"),
            ]);
            const blob = await pdf(<ResumePDF data={data} template={template} />).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${(data.personal.fullName || "resume").replace(/\s+/g, "_")}_${template}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success("Resume downloaded");
        } catch {
            toast.error("Could not generate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    const runAts = async () => {
        setScoring(true);
        setAts(null);
        try {
            const res = await scoreResume(data, targetRole);
            setAts(res);
        } catch {
            toast.error("AI scoring failed. Check your API key and try again.");
        } finally {
            setScoring(false);
        }
    };

    const resetResume = () => {
        if (window.confirm("Clear the resume and start from a blank template?")) {
            setData(emptyResume(user?.displayName || "", user?.email || ""));
            setAts(null);
        }
    };

    const scoreColor =
        !ats ? "" : ats.score >= 75 ? "text-green-400" : ats.score >= 50 ? "text-primary" : "text-red-400";

    return (
        <div className="min-h-screen p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center shadow-[0_0_20px_hsl(48_96%_53%_/_0.4)]">
                        <FileText className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl font-bold">Resume Builder</h1>
                        <p className="text-sm text-muted-foreground">Live preview · 3 templates · AI ATS check · PDF export</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={resetResume}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors">
                        <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                    <button onClick={downloadPdf} disabled={downloading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-semibold hover:shadow-[0_0_20px_hsl(48_96%_53%_/_0.5)] transition-all disabled:opacity-60">
                        {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Download PDF
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* LEFT: Form editor */}
                <ResumeForm
                    data={data} setData={setData}
                    template={template} setTemplate={setTemplate}
                    targetRole={targetRole} setTargetRole={setTargetRole}
                    ats={ats} scoring={scoring} scoreColor={scoreColor}
                    onRunAts={runAts} rewritingId={rewritingId} onRewriteBullets={rewriteBullets}
                />

                {/* RIGHT: Live preview */}
                <div className="lg:sticky lg:top-6 h-fit">
                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Live preview — updates as you type
                    </div>
                    <div className="rounded-2xl bg-secondary/30 border border-border/60 p-3 lg:p-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
                        <ResumePreview data={data} template={template} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumePage;
