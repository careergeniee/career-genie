import React, { memo } from "react";
import { ResumeData, TemplateId } from "@/lib/resume";

/* On-screen live preview rendered on white "paper". Mirrors ResumePDF so what
   the user sees matches the downloaded file. Scoped styles via inline + classes;
   colors are deliberately light (resume paper), independent of the dark theme. */

const bullets = (s: string) =>
    s
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean);

const contact = (p: ResumeData["personal"]) =>
    [p.email, p.phone, p.location, p.website].filter(Boolean);

function Modern({ d }: { d: ResumeData }) {
    return (
        <div className="flex min-h-full text-[#1a1a1a]">
            <div className="w-[34%] bg-[#0f172a] text-white p-5">
                <h1 className="text-xl font-bold leading-tight">
                    {d.personal.fullName || "Your Name"}
                </h1>
                <p className="text-[#9fd0ff] text-sm mb-4">{d.personal.title}</p>

                <Section dark title="Contact">
                    {contact(d.personal).map((c, i) => (
                        <p key={i} className="text-[11px] text-slate-200 mb-1 break-words">
                            {c}
                        </p>
                    ))}
                </Section>

                {d.skills.length > 0 && (
                    <Section dark title="Skills">
                        <div className="flex flex-wrap gap-1.5">
                            {d.skills.map((s, i) => (
                                <span
                                    key={i}
                                    className="text-[10px] bg-[#1e3a5f] px-2 py-0.5 rounded"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </Section>
                )}

                {d.education.filter((e) => e.school || e.degree).length > 0 && (
                    <Section dark title="Education">
                        {d.education
                            .filter((e) => e.school || e.degree)
                            .map((e) => (
                                <div key={e.id} className="mb-2">
                                    <p className="text-[11px] font-bold">{e.degree}</p>
                                    <p className="text-[11px] text-slate-200">{e.school}</p>
                                    <p className="text-[10px] text-[#9fb3c8]">
                                        {[e.start, e.end].filter(Boolean).join(" – ")}
                                    </p>
                                    {e.detail && (
                                        <p className="text-[10px] text-slate-300">{e.detail}</p>
                                    )}
                                </div>
                            ))}
                    </Section>
                )}
            </div>

            <div className="w-[66%] p-5">
                {d.personal.summary && (
                    <Block title="Profile" accent>
                        <p className="text-[12px] text-[#444] leading-relaxed">
                            {d.personal.summary}
                        </p>
                    </Block>
                )}
                {d.experience.filter((e) => e.company || e.role).length > 0 && (
                    <Block title="Experience" accent>
                        {d.experience
                            .filter((e) => e.company || e.role)
                            .map((e) => (
                                <div key={e.id} className="mb-3">
                                    <p className="text-[12px] font-bold">{e.role}</p>
                                    <p className="text-[11px] text-[#1f6feb]">{e.company}</p>
                                    <p className="text-[10px] text-gray-500 mb-1">
                                        {[e.start, e.end].filter(Boolean).join(" – ")}
                                    </p>
                                    {bullets(e.bullets).map((b, i) => (
                                        <p key={i} className="text-[11px] text-[#444] leading-snug">
                                            • {b}
                                        </p>
                                    ))}
                                </div>
                            ))}
                    </Block>
                )}
                {d.projects.filter((p) => p.name).length > 0 && (
                    <Block title="Projects" accent>
                        {d.projects
                            .filter((p) => p.name)
                            .map((p) => (
                                <div key={p.id} className="mb-2">
                                    <p className="text-[12px] font-bold">{p.name}</p>
                                    {p.link && (
                                        <p className="text-[11px] text-[#1f6feb]">{p.link}</p>
                                    )}
                                    <p className="text-[11px] text-[#444]">{p.description}</p>
                                </div>
                            ))}
                    </Block>
                )}
            </div>
        </div>
    );
}

function Classic({ d }: { d: ResumeData }) {
    return (
        <div className="p-8 text-[#1a1a1a]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <h1 className="text-2xl font-bold text-center">{d.personal.fullName || "Your Name"}</h1>
            {d.personal.title && (
                <p className="text-center text-[#444] text-sm">{d.personal.title}</p>
            )}
            <p className="text-center text-[11px] text-[#444] mb-4">
                {contact(d.personal).join("  •  ")}
            </p>

            {d.personal.summary && (
                <ClassicSec title="Summary">
                    <p className="text-[12px] text-[#444] leading-relaxed">{d.personal.summary}</p>
                </ClassicSec>
            )}
            {d.experience.filter((e) => e.company || e.role).length > 0 && (
                <ClassicSec title="Experience">
                    {d.experience
                        .filter((e) => e.company || e.role)
                        .map((e) => (
                            <div key={e.id} className="mb-2">
                                <div className="flex justify-between">
                                    <span className="text-[12px] font-bold">
                                        {e.role}
                                        {e.company ? `, ${e.company}` : ""}
                                    </span>
                                    <span className="text-[11px] text-[#444]">
                                        {[e.start, e.end].filter(Boolean).join(" – ")}
                                    </span>
                                </div>
                                {bullets(e.bullets).map((b, i) => (
                                    <p key={i} className="text-[11px] text-[#444] ml-3 leading-snug">
                                        • {b}
                                    </p>
                                ))}
                            </div>
                        ))}
                </ClassicSec>
            )}
            {d.education.filter((e) => e.school || e.degree).length > 0 && (
                <ClassicSec title="Education">
                    {d.education
                        .filter((e) => e.school || e.degree)
                        .map((e) => (
                            <div key={e.id} className="mb-2">
                                <div className="flex justify-between">
                                    <span className="text-[12px] font-bold">{e.degree}</span>
                                    <span className="text-[11px] text-[#444]">
                                        {[e.start, e.end].filter(Boolean).join(" – ")}
                                    </span>
                                </div>
                                <p className="text-[11px] italic text-[#444]">{e.school}</p>
                                {e.detail && (
                                    <p className="text-[11px] text-[#444] ml-3">{e.detail}</p>
                                )}
                            </div>
                        ))}
                </ClassicSec>
            )}
            {d.projects.filter((p) => p.name).length > 0 && (
                <ClassicSec title="Projects">
                    {d.projects
                        .filter((p) => p.name)
                        .map((p) => (
                            <div key={p.id} className="mb-2">
                                <p className="text-[12px] font-bold">{p.name}</p>
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

function Minimal({ d }: { d: ResumeData }) {
    return (
        <div className="p-10 text-[#1a1a1a]">
            <h1 className="text-3xl font-bold tracking-tight">
                {d.personal.fullName || "Your Name"}
            </h1>
            {d.personal.title && <p className="text-[#444] text-sm">{d.personal.title}</p>}
            <p className="text-[11px] text-gray-500 mb-6">{contact(d.personal).join("  •  ")}</p>

            {d.personal.summary && (
                <p className="text-[12px] text-[#444] leading-relaxed mb-2">
                    {d.personal.summary}
                </p>
            )}
            {d.experience.filter((e) => e.company || e.role).length > 0 && (
                <MinSec title="Experience">
                    {d.experience
                        .filter((e) => e.company || e.role)
                        .map((e) => (
                            <div key={e.id} className="mb-3">
                                <div className="flex justify-between">
                                    <span className="text-[12px] font-bold">{e.role}</span>
                                    <span className="text-[10px] text-gray-400">
                                        {[e.start, e.end].filter(Boolean).join(" – ")}
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#444]">{e.company}</p>
                                {bullets(e.bullets).map((b, i) => (
                                    <p key={i} className="text-[11px] text-[#444] leading-snug">
                                        — {b}
                                    </p>
                                ))}
                            </div>
                        ))}
                </MinSec>
            )}
            {d.projects.filter((p) => p.name).length > 0 && (
                <MinSec title="Projects">
                    {d.projects
                        .filter((p) => p.name)
                        .map((p) => (
                            <div key={p.id} className="mb-2">
                                <div className="flex justify-between">
                                    <span className="text-[12px] font-bold">{p.name}</span>
                                    {p.link && (
                                        <span className="text-[10px] text-gray-400">{p.link}</span>
                                    )}
                                </div>
                                <p className="text-[11px] text-[#444]">{p.description}</p>
                            </div>
                        ))}
                </MinSec>
            )}
            {d.education.filter((e) => e.school || e.degree).length > 0 && (
                <MinSec title="Education">
                    {d.education
                        .filter((e) => e.school || e.degree)
                        .map((e) => (
                            <div key={e.id} className="mb-2">
                                <div className="flex justify-between">
                                    <span className="text-[12px] font-bold">{e.degree}</span>
                                    <span className="text-[10px] text-gray-400">
                                        {[e.start, e.end].filter(Boolean).join(" – ")}
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#444]">{e.school}</p>
                                {e.detail && <p className="text-[11px] text-[#444]">{e.detail}</p>}
                            </div>
                        ))}
                </MinSec>
            )}
            {d.skills.length > 0 && (
                <MinSec title="Skills">
                    <p className="text-[11px] text-[#444] leading-relaxed">
                        {d.skills.join("   ·   ")}
                    </p>
                </MinSec>
            )}
        </div>
    );
}

/* small helpers */
const Section = ({ title, dark, children }: { title: string; dark?: boolean; children: React.ReactNode }) => (
    <div className="mb-3">
        <p
            className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                dark ? "text-[#9fd0ff]" : "text-[#1f6feb]"
            }`}
        >
            {title}
        </p>
        {children}
    </div>
);
const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-3">
        <p className="text-[12px] font-bold uppercase tracking-wider text-[#1f6feb] mb-1.5">
            {title}
        </p>
        {children}
    </div>
);
const ClassicSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-2">
        <p className="text-[12px] font-bold uppercase tracking-wide border-b border-black pb-0.5 mb-1.5">
            {title}
        </p>
        {children}
    </div>
);
const MinSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
            {title}
        </p>
        {children}
    </div>
);

export const ResumePreview = memo(function ResumePreview({
    data,
    template,
}: {
    data: ResumeData;
    template: TemplateId;
}) {
    return (
        <div className="bg-white text-black w-full shadow-lg rounded-sm overflow-hidden min-h-[60vh]">
            {template === "modern" ? (
                <Modern d={data} />
            ) : template === "classic" ? (
                <Classic d={data} />
            ) : (
                <Minimal d={data} />
            )}
        </div>
    );
});
