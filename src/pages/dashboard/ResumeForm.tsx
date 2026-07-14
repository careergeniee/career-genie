import React, { useState } from "react";
import {
    Plus, Trash2, User, GraduationCap,
    Briefcase, Wrench, FolderGit2, Loader2, X,
    CheckCircle2, AlertCircle, Target, Wand2,
} from "lucide-react";
import genieLogo3 from "@/assets/genie-logo3.png";
import {
    ResumeData, TemplateId, TEMPLATES, AtsResult,
    newEducation, newExperience, newProject,
} from "@/lib/resume";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const inputCls =
    "w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/70";
const labelCls = "text-xs font-medium text-muted-foreground mb-1 block";

interface SectionCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}
const SectionCard = ({ icon: Icon, title, children, action }: SectionCardProps) => (
    <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" />
                <h3 className="font-display font-bold text-sm">{title}</h3>
            </div>
            {action}
        </div>
        {children}
    </div>
);

const AddBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-glow transition-colors"
    >
        <Plus className="w-3.5 h-3.5" /> {label}
    </button>
);

export interface ResumeFormProps {
    data: ResumeData;
    setData: React.Dispatch<React.SetStateAction<ResumeData>>;
    template: TemplateId;
    setTemplate: React.Dispatch<React.SetStateAction<TemplateId>>;
    targetRole: string;
    setTargetRole: React.Dispatch<React.SetStateAction<string>>;
    ats: AtsResult | null;
    scoring: boolean;
    scoreColor: string;
    onRunAts: () => void;
    rewritingId: string | null;
    onRewriteBullets: (expId: string) => void;
}

export const ResumeForm = ({
    data, setData, template, setTemplate,
    targetRole, setTargetRole, ats, scoring, scoreColor,
    onRunAts, rewritingId, onRewriteBullets,
}: ResumeFormProps) => {
    const [skillInput, setSkillInput] = useState("");

    const setPersonal = (k: keyof ResumeData["personal"], v: string) =>
        setData((d) => ({ ...d, personal: { ...d.personal, [k]: v } }));

    const updateList = <K extends "education" | "experience" | "projects">(
        list: K, id: string, field: string, value: string
    ) =>
        setData((d) => ({
            ...d,
            [list]: (d[list] as unknown as Array<{ id: string } & Record<string, string>>).map((it) =>
                it.id === id ? { ...it, [field]: value } : it
            ),
        }));

    const removeFrom = (list: "education" | "experience" | "projects", id: string) =>
        setData((d) => ({ ...d, [list]: (d[list] as Array<{ id: string }>).filter((it) => it.id !== id) }));

    const addSkill = () => {
        const s = skillInput.trim();
        if (!s) return;
        if (!data.skills.includes(s)) setData((d) => ({ ...d, skills: [...d.skills, s] }));
        setSkillInput("");
    };

    return (
        <div className="space-y-5">
            {/* Template switcher */}
            <div className="glass-card rounded-2xl p-5">
                <h3 className="font-display font-bold text-sm mb-3">Template</h3>
                <div className="grid grid-cols-3 gap-2">
                    {TEMPLATES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTemplate(t.id)}
                            className={cn(
                                "rounded-xl border p-3 text-left transition-all",
                                template === t.id
                                    ? "border-primary/60 bg-primary/10"
                                    : "border-border/60 hover:border-border bg-secondary/30"
                            )}
                        >
                            <p className="text-sm font-semibold">{t.label}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{t.blurb}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Personal */}
            <SectionCard icon={User} title="Personal Info">
                <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                        <label className={labelCls}>Full name</label>
                        <input className={inputCls} value={data.personal.fullName}
                            onChange={(e) => setPersonal("fullName", e.target.value)} placeholder="Abdullah" />
                    </div>
                    <div className="col-span-2">
                        <label className={labelCls}>Professional title</label>
                        <input className={inputCls} value={data.personal.title}
                            onChange={(e) => setPersonal("title", e.target.value)} placeholder="Frontend Developer" />
                    </div>
                    <div>
                        <label className={labelCls}>Email</label>
                        <input type="email" className={inputCls} value={data.personal.email}
                            onChange={(e) => setPersonal("email", e.target.value)} placeholder="you@email.com" />
                    </div>
                    <div>
                        <label className={labelCls}>Phone</label>
                        <input className={inputCls} value={data.personal.phone}
                            onChange={(e) => setPersonal("phone", e.target.value)} placeholder="+92 300 ..." />
                    </div>
                    <div>
                        <label className={labelCls}>Location</label>
                        <input className={inputCls} value={data.personal.location}
                            onChange={(e) => setPersonal("location", e.target.value)} placeholder="Lahore, Pakistan" />
                    </div>
                    <div>
                        <label className={labelCls}>Website / LinkedIn</label>
                        <input type="text" inputMode="url" className={inputCls} value={data.personal.website}
                            onChange={(e) => setPersonal("website", e.target.value)} placeholder="github.com/you" />
                    </div>
                    <div className="col-span-2">
                        <label className={labelCls}>Professional summary</label>
                        <textarea className={cn(inputCls, "min-h-[72px] resize-y")} value={data.personal.summary}
                            onChange={(e) => setPersonal("summary", e.target.value)}
                            placeholder="2-3 lines about who you are and what you do." />
                    </div>
                </div>
            </SectionCard>

            {/* Experience */}
            <SectionCard icon={Briefcase} title="Experience" action={
                <AddBtn label="Add job" onClick={() =>
                    setData((d) => ({ ...d, experience: [...d.experience, newExperience()] }))} />
            }>
                <div className="space-y-4">
                    {data.experience.map((e, idx) => (
                        <div key={e.id} className="rounded-xl border border-border/40 p-3 relative">
                            {data.experience.length > 1 && (
                                <button onClick={() => removeFrom("experience", e.id)}
                                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                            <p className="text-[11px] text-muted-foreground mb-2">Job {idx + 1}</p>
                            <div className="grid grid-cols-2 gap-3">
                                <input className={inputCls} placeholder="Role" value={e.role}
                                    onChange={(ev) => updateList("experience", e.id, "role", ev.target.value)} />
                                <input className={inputCls} placeholder="Company" value={e.company}
                                    onChange={(ev) => updateList("experience", e.id, "company", ev.target.value)} />
                                <input className={inputCls} placeholder="Start (e.g. 2023)" value={e.start}
                                    onChange={(ev) => updateList("experience", e.id, "start", ev.target.value)} />
                                <input className={inputCls} placeholder="End (e.g. Present)" value={e.end}
                                    onChange={(ev) => updateList("experience", e.id, "end", ev.target.value)} />
                                <div className="col-span-2">
                                    <textarea className={cn(inputCls, "min-h-[64px] resize-y")}
                                        placeholder="One achievement per line" value={e.bullets}
                                        onChange={(ev) => updateList("experience", e.id, "bullets", ev.target.value)} />
                                    <button onClick={() => onRewriteBullets(e.id)} disabled={rewritingId === e.id}
                                        className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-glow transition-colors disabled:opacity-50">
                                        {rewritingId === e.id
                                            ? <><Loader2 className="w-3 h-3 animate-spin" /> Rewriting...</>
                                            : <><Wand2 className="w-3 h-3" /> Rewrite with AI</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Education */}
            <SectionCard icon={GraduationCap} title="Education" action={
                <AddBtn label="Add school" onClick={() =>
                    setData((d) => ({ ...d, education: [...d.education, newEducation()] }))} />
            }>
                <div className="space-y-4">
                    {data.education.map((e) => (
                        <div key={e.id} className="rounded-xl border border-border/40 p-3 relative">
                            {data.education.length > 1 && (
                                <button onClick={() => removeFrom("education", e.id)}
                                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                <input className={cn(inputCls, "col-span-2")} placeholder="Degree (BS Computer Science)"
                                    value={e.degree} onChange={(ev) => updateList("education", e.id, "degree", ev.target.value)} />
                                <input className={cn(inputCls, "col-span-2")} placeholder="School / University"
                                    value={e.school} onChange={(ev) => updateList("education", e.id, "school", ev.target.value)} />
                                <input className={inputCls} placeholder="Start" value={e.start}
                                    onChange={(ev) => updateList("education", e.id, "start", ev.target.value)} />
                                <input className={inputCls} placeholder="End" value={e.end}
                                    onChange={(ev) => updateList("education", e.id, "end", ev.target.value)} />
                                <input className={cn(inputCls, "col-span-2")} placeholder="Detail (CGPA, honors)"
                                    value={e.detail} onChange={(ev) => updateList("education", e.id, "detail", ev.target.value)} />
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Skills */}
            <SectionCard icon={Wrench} title="Skills">
                <div className="flex gap-2 mb-3">
                    <input className={inputCls} placeholder="Type a skill and press Enter"
                        value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
                    <button onClick={addSkill}
                        className="px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-sm shrink-0">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.skills.map((s) => (
                        <span key={s} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/15 border border-primary/30 text-xs">
                            {s}
                            <button onClick={() => setData((d) => ({ ...d, skills: d.skills.filter((x) => x !== s) }))}
                                className="hover:text-destructive">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {data.skills.length === 0 && <p className="text-xs text-muted-foreground">No skills added yet.</p>}
                </div>
            </SectionCard>

            {/* Projects */}
            <SectionCard icon={FolderGit2} title="Projects" action={
                <AddBtn label="Add project" onClick={() =>
                    setData((d) => ({ ...d, projects: [...d.projects, newProject()] }))} />
            }>
                <div className="space-y-4">
                    {data.projects.map((p) => (
                        <div key={p.id} className="rounded-xl border border-border/40 p-3 relative">
                            {data.projects.length > 1 && (
                                <button onClick={() => removeFrom("projects", p.id)}
                                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                <input className={inputCls} placeholder="Project name" value={p.name}
                                    onChange={(ev) => updateList("projects", p.id, "name", ev.target.value)} />
                                <input className={inputCls} placeholder="Link (optional)" value={p.link}
                                    onChange={(ev) => updateList("projects", p.id, "link", ev.target.value)} />
                                <textarea className={cn(inputCls, "col-span-2 min-h-[56px] resize-y")}
                                    placeholder="What it does and your role" value={p.description}
                                    onChange={(ev) => updateList("projects", p.id, "description", ev.target.value)} />
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* ATS Checker */}
            <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-primary" />
                    <h3 className="font-display font-bold text-sm">AI ATS Score Checker</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                    Enter the role you're targeting and let AI rate how well your resume matches.
                </p>
                <div className="flex gap-2 mb-4">
                    <input className={inputCls} placeholder="e.g. Software Engineer"
                        value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
                    <button onClick={onRunAts} disabled={scoring}
                        className="flex items-center gap-2 px-4 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-semibold shrink-0 disabled:opacity-60">
                        {scoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <img src={genieLogo3} alt="" className="w-4 h-4 object-contain" />}
                        Check
                    </button>
                </div>
                {scoring && <p className="text-xs text-muted-foreground animate-pulse">Analyzing your resume against the role...</p>}
                {ats && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={cn("font-display text-4xl font-bold", scoreColor)}>
                                {ats.score}<span className="text-lg text-muted-foreground">/100</span>
                            </div>
                            <div className="flex-1">
                                <Progress value={ats.score} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-2">{ats.summary}</p>
                            </div>
                        </div>
                        {ats.strengths.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-green-400 mb-1.5 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                                </p>
                                <ul className="space-y-1">
                                    {ats.strengths.map((s, i) => (
                                        <li key={i} className="text-xs text-muted-foreground pl-4">• {s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {ats.improvements.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-primary mb-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" /> Improvements
                                </p>
                                <ul className="space-y-1">
                                    {ats.improvements.map((s, i) => (
                                        <li key={i} className="text-xs text-muted-foreground pl-4">• {s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {ats.missingKeywords.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-red-400 mb-1.5">Missing keywords</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {ats.missingKeywords.map((k, i) => (
                                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-300">{k}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
