import React, { memo } from "react";
import { ResumeData, TemplateId } from "@/lib/resume";

const bullets = (s: string) =>
    s.split("\n").map((b) => b.trim()).filter(Boolean);

const contact = (p: ResumeData["personal"]) =>
    [p.email, p.phone, p.location, p.website].filter(Boolean);

/* ─────────────────────────── MODERN ─────────────────────────── */
function Modern({ d }: { d: ResumeData }) {
    return (
        <div className="flex min-h-full text-[#1a1a1a]">
            <div className="w-[34%] bg-[#0f172a] text-white p-6">
                <h1 className="text-xl font-bold leading-tight">
                    {d.personal.fullName || "Your Name"}
                </h1>
                <p className="text-[#9fd0ff] text-[12px] mb-5">{d.personal.title}</p>

                <Section dark title="Contact">
                    {contact(d.personal).map((c, i) => (
                        <p key={i} className="text-[11px] text-slate-200 mb-1.5 break-words">{c}</p>
                    ))}
                </Section>

                {d.skills.length > 0 && (
                    <Section dark title="Skills">
                        <div className="flex flex-wrap gap-1.5">
                            {d.skills.map((s, i) => (
                                <span key={i} className="text-[10px] bg-[#1e3a5f] px-2 py-0.5 rounded">{s}</span>
                            ))}
                        </div>
                    </Section>
                )}

                {d.education.filter((e) => e.school || e.degree).length > 0 && (
                    <Section dark title="Education">
                        {d.education.filter((e) => e.school || e.degree).map((e) => (
                            <div key={e.id} className="mb-3">
                                <p className="text-[11px] font-bold">{e.degree}</p>
                                <p className="text-[11px] text-slate-200">{e.school}</p>
                                <p className="text-[10px] text-[#9fb3c8]">{[e.start, e.end].filter(Boolean).join(" – ")}</p>
                                {e.detail && <p className="text-[10px] text-slate-300">{e.detail}</p>}
                            </div>
                        ))}
                    </Section>
                )}
            </div>

            <div className="w-[66%] p-6">
                {d.personal.summary && (
                    <Block title="Profile">
                        <p className="text-[12px] text-[#444] leading-relaxed">{d.personal.summary}</p>
                    </Block>
                )}
                {d.experience.filter((e) => e.company || e.role).length > 0 && (
                    <Block title="Experience">
                        {d.experience.filter((e) => e.company || e.role).map((e) => (
                            <div key={e.id} className="mb-4">
                                <p className="text-[13px] font-bold">{e.role}</p>
                                <p className="text-[11px] text-[#1f6feb]">{e.company}</p>
                                <p className="text-[10px] text-gray-500 mb-1">{[e.start, e.end].filter(Boolean).join(" – ")}</p>
                                {bullets(e.bullets).map((b, i) => (
                                    <p key={i} className="text-[11px] text-[#444] leading-snug">• {b}</p>
                                ))}
                            </div>
                        ))}
                    </Block>
                )}
                {d.projects.filter((p) => p.name).length > 0 && (
                    <Block title="Projects">
                        {d.projects.filter((p) => p.name).map((p) => (
                            <div key={p.id} className="mb-3">
                                <p className="text-[12px] font-bold">{p.name}</p>
                                {p.link && <p className="text-[11px] text-[#1f6feb]">{p.link}</p>}
                                <p className="text-[11px] text-[#444]">{p.description}</p>
                            </div>
                        ))}
                    </Block>
                )}
            </div>
        </div>
    );
}

/* ─────────────────────────── CLASSIC ─────────────────────────── */
function Classic({ d }: { d: ResumeData }) {
    return (
        <div className="p-10 text-[#1a1a1a]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <h1 className="text-2xl font-bold text-center">{d.personal.fullName || "Your Name"}</h1>
            {d.personal.title && <p className="text-center text-[#444] text-[13px]">{d.personal.title}</p>}
            <p className="text-center text-[11px] text-[#444] mb-5">{contact(d.personal).join("  •  ")}</p>

            {d.personal.summary && (
                <ClassicSec title="Summary">
                    <p className="text-[12px] text-[#444] leading-relaxed">{d.personal.summary}</p>
                </ClassicSec>
            )}
            {d.experience.filter((e) => e.company || e.role).length > 0 && (
                <ClassicSec title="Experience">
                    {d.experience.filter((e) => e.company || e.role).map((e) => (
                        <div key={e.id} className="mb-3">
                            <div className="flex justify-between">
                                <span className="text-[13px] font-bold">{e.role}{e.company ? `, ${e.company}` : ""}</span>
                                <span className="text-[11px] text-[#444]">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                            </div>
                            {bullets(e.bullets).map((b, i) => (
                                <p key={i} className="text-[11px] text-[#444] ml-3 leading-snug">• {b}</p>
                            ))}
                        </div>
                    ))}
                </ClassicSec>
            )}
            {d.education.filter((e) => e.school || e.degree).length > 0 && (
                <ClassicSec title="Education">
                    {d.education.filter((e) => e.school || e.degree).map((e) => (
                        <div key={e.id} className="mb-2">
                            <div className="flex justify-between">
                                <span className="text-[13px] font-bold">{e.degree}</span>
                                <span className="text-[11px] text-[#444]">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                            </div>
                            <p className="text-[11px] italic text-[#444]">{e.school}</p>
                            {e.detail && <p className="text-[11px] text-[#444] ml-3">{e.detail}</p>}
                        </div>
                    ))}
                </ClassicSec>
            )}
            {d.projects.filter((p) => p.name).length > 0 && (
                <ClassicSec title="Projects">
                    {d.projects.filter((p) => p.name).map((p) => (
                        <div key={p.id} className="mb-2">
                            <p className="text-[13px] font-bold">{p.name}</p>
                            <p className="text-[11px] text-[#444]">{p.description}</p>
                            {p.link && <p className="text-[11px] text-[#444]">{p.link}</p>}
                        </div>
                    ))}
                </ClassicSec>
            )}
            {d.skills.length > 0 && (
                <ClassicSec title="Skills">
                    <p className="text-[12px] text-[#444]">{d.skills.join("  •  ")}</p>
                </ClassicSec>
            )}
        </div>
    );
}

/* ─────────────────────────── MINIMAL ─────────────────────────── */
function Minimal({ d }: { d: ResumeData }) {
    return (
        <div className="p-12 text-[#1a1a1a]">
            <h1 className="text-3xl font-bold tracking-tight">{d.personal.fullName || "Your Name"}</h1>
            {d.personal.title && <p className="text-[#444] text-[13px]">{d.personal.title}</p>}
            <p className="text-[11px] text-gray-500 mb-7">{contact(d.personal).join("  •  ")}</p>

            {d.personal.summary && (
                <p className="text-[12px] text-[#444] leading-relaxed mb-3">{d.personal.summary}</p>
            )}
            {d.experience.filter((e) => e.company || e.role).length > 0 && (
                <MinSec title="Experience">
                    {d.experience.filter((e) => e.company || e.role).map((e) => (
                        <div key={e.id} className="mb-4">
                            <div className="flex justify-between">
                                <span className="text-[13px] font-bold">{e.role}</span>
                                <span className="text-[10px] text-gray-400">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                            </div>
                            <p className="text-[11px] text-[#444]">{e.company}</p>
                            {bullets(e.bullets).map((b, i) => (
                                <p key={i} className="text-[11px] text-[#444] leading-snug">— {b}</p>
                            ))}
                        </div>
                    ))}
                </MinSec>
            )}
            {d.projects.filter((p) => p.name).length > 0 && (
                <MinSec title="Projects">
                    {d.projects.filter((p) => p.name).map((p) => (
                        <div key={p.id} className="mb-3">
                            <div className="flex justify-between">
                                <span className="text-[13px] font-bold">{p.name}</span>
                                {p.link && <span className="text-[10px] text-gray-400">{p.link}</span>}
                            </div>
                            <p className="text-[11px] text-[#444]">{p.description}</p>
                        </div>
                    ))}
                </MinSec>
            )}
            {d.education.filter((e) => e.school || e.degree).length > 0 && (
                <MinSec title="Education">
                    {d.education.filter((e) => e.school || e.degree).map((e) => (
                        <div key={e.id} className="mb-3">
                            <div className="flex justify-between">
                                <span className="text-[13px] font-bold">{e.degree}</span>
                                <span className="text-[10px] text-gray-400">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
                            </div>
                            <p className="text-[11px] text-[#444]">{e.school}</p>
                            {e.detail && <p className="text-[11px] text-[#444]">{e.detail}</p>}
                        </div>
                    ))}
                </MinSec>
            )}
            {d.skills.length > 0 && (
                <MinSec title="Skills">
                    <p className="text-[11px] text-[#444] leading-relaxed">{d.skills.join("   ·   ")}</p>
                </MinSec>
            )}
        </div>
    );
}

/* ─────────────────────────── CREATIVE ─────────────────────────── */
function Creative({ d }: { d: ResumeData }) {
    return (
        <div className="text-[#1a1a1a]">
            <div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }} className="px-8 py-8 text-white">
                <h1 className="text-[28px] font-bold tracking-tight leading-tight">
                    {d.personal.fullName || "Your Name"}
                </h1>
                {d.personal.title && <p className="text-[#c4b5fd] text-[13px] mt-1">{d.personal.title}</p>}
                <p className="text-[11px] text-[#ddd6fe] mt-2">{contact(d.personal).join("  ·  ")}</p>
            </div>

            <div className="p-8">
                {d.personal.summary && (
                    <CreativeSec title="About Me">
                        <p className="text-[13px] text-[#555] leading-relaxed">{d.personal.summary}</p>
                    </CreativeSec>
                )}
                {d.experience.filter((e) => e.company || e.role).length > 0 && (
                    <CreativeSec title="Experience">
                        {d.experience.filter((e) => e.company || e.role).map((e) => (
                            <div key={e.id} className="mb-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[14px] font-bold">{e.role}</p>
                                        <p className="text-[12px] text-[#4f46e5] font-semibold">{e.company}</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 shrink-0 mt-0.5">
                                        {[e.start, e.end].filter(Boolean).join(" – ")}
                                    </p>
                                </div>
                                <div className="mt-1 space-y-0.5">
                                    {bullets(e.bullets).map((b, i) => (
                                        <p key={i} className="text-[12px] text-[#555] leading-snug">• {b}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CreativeSec>
                )}
                {d.education.filter((e) => e.school || e.degree).length > 0 && (
                    <CreativeSec title="Education">
                        {d.education.filter((e) => e.school || e.degree).map((e) => (
                            <div key={e.id} className="mb-3">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-[13px] font-bold">{e.degree}</p>
                                        <p className="text-[12px] text-[#4f46e5]">{e.school}</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400">{[e.start, e.end].filter(Boolean).join(" – ")}</p>
                                </div>
                                {e.detail && <p className="text-[11px] text-gray-500 mt-0.5">{e.detail}</p>}
                            </div>
                        ))}
                    </CreativeSec>
                )}
                {d.projects.filter((p) => p.name).length > 0 && (
                    <CreativeSec title="Projects">
                        {d.projects.filter((p) => p.name).map((p) => (
                            <div key={p.id} className="mb-3">
                                <p className="text-[13px] font-bold">{p.name}</p>
                                {p.link && <p className="text-[11px] text-[#4f46e5]">{p.link}</p>}
                                <p className="text-[12px] text-[#555]">{p.description}</p>
                            </div>
                        ))}
                    </CreativeSec>
                )}
                {d.skills.length > 0 && (
                    <CreativeSec title="Skills">
                        <div className="flex flex-wrap gap-2">
                            {d.skills.map((s, i) => (
                                <span key={i} className="text-[11px] px-3 py-1 rounded-full bg-[#ede9fe] text-[#4f46e5] font-semibold">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </CreativeSec>
                )}
            </div>
        </div>
    );
}

/* ─────────────────────────── EXECUTIVE ─────────────────────────── */
function Executive({ d }: { d: ResumeData }) {
    return (
        <div className="flex min-h-full text-[#1a1a1a]">
            <div className="w-[33%] bg-[#0a2540] text-white p-6">
                <h1 className="text-[20px] font-bold leading-tight text-white">
                    {d.personal.fullName || "Your Name"}
                </h1>
                {d.personal.title && (
                    <p className="text-[#c9a227] text-[12px] mt-1 mb-5 font-medium">{d.personal.title}</p>
                )}

                <ExecSideSec title="Contact">
                    {contact(d.personal).map((c, i) => (
                        <p key={i} className="text-[11px] text-[#c8d8e8] mb-1.5 break-words">{c}</p>
                    ))}
                </ExecSideSec>

                {d.skills.length > 0 && (
                    <ExecSideSec title="Skills">
                        {d.skills.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 mb-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] shrink-0" />
                                <span className="text-[11px] text-[#c8d8e8]">{s}</span>
                            </div>
                        ))}
                    </ExecSideSec>
                )}

                {d.education.filter((e) => e.school || e.degree).length > 0 && (
                    <ExecSideSec title="Education">
                        {d.education.filter((e) => e.school || e.degree).map((e) => (
                            <div key={e.id} className="mb-3">
                                <p className="text-[11px] font-bold text-white">{e.degree}</p>
                                <p className="text-[11px] text-[#c8d8e8]">{e.school}</p>
                                <p className="text-[10px] text-[#7fa3bf]">{[e.start, e.end].filter(Boolean).join(" – ")}</p>
                                {e.detail && <p className="text-[10px] text-[#9fb8cc]">{e.detail}</p>}
                            </div>
                        ))}
                    </ExecSideSec>
                )}
            </div>

            <div className="w-[67%] p-6">
                {d.personal.summary && (
                    <div className="mb-5 pb-4 border-b-2 border-[#c9a227]">
                        <p className="text-[13px] text-[#444] leading-relaxed">{d.personal.summary}</p>
                    </div>
                )}
                {d.experience.filter((e) => e.company || e.role).length > 0 && (
                    <ExecMainSec title="Experience">
                        {d.experience.filter((e) => e.company || e.role).map((e) => (
                            <div key={e.id} className="mb-5">
                                <p className="text-[14px] font-bold">{e.role}</p>
                                <p className="text-[12px] text-[#c9a227] font-semibold">{e.company}</p>
                                <p className="text-[10px] text-gray-400 mb-1">{[e.start, e.end].filter(Boolean).join(" – ")}</p>
                                {bullets(e.bullets).map((b, i) => (
                                    <p key={i} className="text-[12px] text-[#444] leading-snug">• {b}</p>
                                ))}
                            </div>
                        ))}
                    </ExecMainSec>
                )}
                {d.projects.filter((p) => p.name).length > 0 && (
                    <ExecMainSec title="Projects">
                        {d.projects.filter((p) => p.name).map((p) => (
                            <div key={p.id} className="mb-4">
                                <p className="text-[13px] font-bold">{p.name}</p>
                                {p.link && <p className="text-[11px] text-[#c9a227]">{p.link}</p>}
                                <p className="text-[12px] text-[#444]">{p.description}</p>
                            </div>
                        ))}
                    </ExecMainSec>
                )}
            </div>
        </div>
    );
}

/* ─────────────────────────── VIBRANT ─────────────────────────── */
function Vibrant({ d }: { d: ResumeData }) {
    return (
        <div className="text-[#1a1a1a]">
            <div className="bg-[#0d9488] px-8 py-7 text-white">
                <h1 className="text-[28px] font-bold leading-tight">{d.personal.fullName || "Your Name"}</h1>
                {d.personal.title && <p className="text-[#99f6e4] text-[13px] mt-0.5">{d.personal.title}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    {contact(d.personal).map((c, i) => (
                        <span key={i} className="text-[11px] text-[#ccfbf1]">{c}</span>
                    ))}
                </div>
            </div>

            <div className="flex">
                <div className="flex-1 p-7">
                    {d.personal.summary && (
                        <p className="text-[13px] text-[#555] leading-relaxed mb-5 pb-4 border-b border-gray-100">
                            {d.personal.summary}
                        </p>
                    )}
                    {d.experience.filter((e) => e.company || e.role).length > 0 && (
                        <VibrantSec title="Experience">
                            {d.experience.filter((e) => e.company || e.role).map((e) => (
                                <div key={e.id} className="mb-5">
                                    <div className="flex justify-between items-start">
                                        <p className="text-[14px] font-bold">{e.role}</p>
                                        <p className="text-[10px] text-gray-400 shrink-0 mt-0.5">
                                            {[e.start, e.end].filter(Boolean).join(" – ")}
                                        </p>
                                    </div>
                                    <p className="text-[12px] text-[#ea580c] font-semibold mb-1">{e.company}</p>
                                    {bullets(e.bullets).map((b, i) => (
                                        <p key={i} className="text-[12px] text-[#555] leading-snug">• {b}</p>
                                    ))}
                                </div>
                            ))}
                        </VibrantSec>
                    )}
                    {d.projects.filter((p) => p.name).length > 0 && (
                        <VibrantSec title="Projects">
                            {d.projects.filter((p) => p.name).map((p) => (
                                <div key={p.id} className="mb-4">
                                    <p className="text-[13px] font-bold">{p.name}</p>
                                    {p.link && <p className="text-[11px] text-[#0d9488]">{p.link}</p>}
                                    <p className="text-[12px] text-[#555]">{p.description}</p>
                                </div>
                            ))}
                        </VibrantSec>
                    )}
                </div>

                <div className="w-[195px] shrink-0 bg-[#f0fdf9] border-l border-[#ccfbf1] p-5">
                    {d.skills.length > 0 && (
                        <div className="mb-6">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0d9488] mb-3">Skills</p>
                            <div className="flex flex-col gap-1.5">
                                {d.skills.map((s, i) => (
                                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-[#ccfbf1] text-[#0d7a70] font-semibold text-center">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {d.education.filter((e) => e.school || e.degree).length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0d9488] mb-3">Education</p>
                            {d.education.filter((e) => e.school || e.degree).map((e) => (
                                <div key={e.id} className="mb-4">
                                    <p className="text-[11px] font-bold leading-snug">{e.degree}</p>
                                    <p className="text-[11px] text-[#555]">{e.school}</p>
                                    <p className="text-[10px] text-gray-400">{[e.start, e.end].filter(Boolean).join(" – ")}</p>
                                    {e.detail && <p className="text-[10px] text-gray-400">{e.detail}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────── shared helpers ──────────────────────── */
const Section = ({ title, dark, children }: { title: string; dark?: boolean; children: React.ReactNode }) => (
    <div className="mb-4">
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${dark ? "text-[#9fd0ff]" : "text-[#1f6feb]"}`}>
            {title}
        </p>
        {children}
    </div>
);
const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4">
        <p className="text-[12px] font-bold uppercase tracking-wider text-[#1f6feb] mb-2">{title}</p>
        {children}
    </div>
);
const ClassicSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-3">
        <p className="text-[12px] font-bold uppercase tracking-wide border-b border-black pb-0.5 mb-2">{title}</p>
        {children}
    </div>
);
const MinSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">{title}</p>
        {children}
    </div>
);
const CreativeSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full bg-[#4f46e5]" />
            <p className="text-[13px] font-bold uppercase tracking-wide text-[#4f46e5]">{title}</p>
        </div>
        {children}
    </div>
);
const ExecSideSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#c9a227] mb-2">{title}</p>
        {children}
    </div>
);
const ExecMainSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
            <p className="text-[12px] font-bold uppercase tracking-wider text-[#0a2540]">{title}</p>
            <div className="flex-1 h-0.5 bg-[#c9a227]" />
        </div>
        {children}
    </div>
);
const VibrantSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
            <p className="text-[13px] font-bold uppercase tracking-wide text-[#ea580c]">{title}</p>
            <div className="flex-1 h-px bg-[#fed7aa]" />
        </div>
        {children}
    </div>
);

/* ─────────────────────────── EXPORT ─────────────────────────── */
export const ResumePreview = memo(function ResumePreview({
    data,
    template,
}: {
    data: ResumeData;
    template: TemplateId;
}) {
    return (
        <div className="bg-white text-black w-full shadow-xl rounded-sm overflow-hidden min-h-[1100px]">
            {template === "modern" ? (
                <Modern d={data} />
            ) : template === "classic" ? (
                <Classic d={data} />
            ) : template === "minimal" ? (
                <Minimal d={data} />
            ) : template === "creative" ? (
                <Creative d={data} />
            ) : template === "executive" ? (
                <Executive d={data} />
            ) : (
                <Vibrant d={data} />
            )}
        </div>
    );
});
