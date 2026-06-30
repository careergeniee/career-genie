import { ResumeData } from "@/lib/resume";
import { bullets, contact, Section, Block } from "./shared";

export function Modern({ d }: { d: ResumeData }) {
    return (
        <div className="flex min-h-full text-[#1a1a1a]">
            <div className="w-[35%] bg-[#0f172a] text-white p-7">
                <h1 className="text-[22px] font-bold leading-tight text-white">
                    {d.personal.fullName || "Your Name"}
                </h1>
                <p className="text-[#9fd0ff] text-[13px] mb-5">{d.personal.title}</p>

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

            <div className="w-[65%] p-7 pt-8">
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
