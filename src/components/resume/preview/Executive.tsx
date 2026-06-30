import { ResumeData } from "@/lib/resume";
import { bullets, contact, ExecSideSec, ExecMainSec } from "./shared";

export function Executive({ d }: { d: ResumeData }) {
    return (
        <div className="flex min-h-full text-[#1a1a1a]">
            <div className="w-[42%] bg-[#0a2540] text-white p-8">
                <h1 className="text-[22px] font-bold leading-tight text-white">
                    {d.personal.fullName || "Your Name"}
                </h1>
                {d.personal.title && (
                    <p className="text-[#c9a227] text-[13px] mt-1 mb-7 font-semibold">{d.personal.title}</p>
                )}

                <ExecSideSec title="Contact">
                    {contact(d.personal).map((c, i) => (
                        <p key={i} className="text-[12px] text-[#c8d8e8] mb-2 break-words leading-snug">{c}</p>
                    ))}
                </ExecSideSec>

                {d.skills.length > 0 && (
                    <ExecSideSec title="Skills">
                        {d.skills.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-[#c9a227] shrink-0" />
                                <span className="text-[12px] text-[#c8d8e8]">{s}</span>
                            </div>
                        ))}
                    </ExecSideSec>
                )}

                {d.education.filter((e) => e.school || e.degree).length > 0 && (
                    <ExecSideSec title="Education">
                        {d.education.filter((e) => e.school || e.degree).map((e) => (
                            <div key={e.id} className="mb-4">
                                <p className="text-[12px] font-bold text-white leading-snug">{e.degree}</p>
                                <p className="text-[12px] text-[#c8d8e8]">{e.school}</p>
                                <p className="text-[10px] text-[#7fa3bf] mt-0.5">{[e.start, e.end].filter(Boolean).join(" – ")}</p>
                                {e.detail && <p className="text-[10px] text-[#9fb8cc]">{e.detail}</p>}
                            </div>
                        ))}
                    </ExecSideSec>
                )}
            </div>

            <div className="w-[58%] p-8 pt-10">
                {d.personal.summary && (
                    <div className="mb-6 pb-5 border-b-2 border-[#c9a227]">
                        <p className="text-[13px] text-[#444] leading-relaxed">{d.personal.summary}</p>
                    </div>
                )}
                {d.experience.filter((e) => e.company || e.role).length > 0 && (
                    <ExecMainSec title="Experience">
                        {d.experience.filter((e) => e.company || e.role).map((e) => (
                            <div key={e.id} className="mb-6">
                                <p className="text-[14px] font-bold">{e.role}</p>
                                <p className="text-[12px] text-[#c9a227] font-semibold">{e.company}</p>
                                <p className="text-[10px] text-gray-400 mb-1.5">{[e.start, e.end].filter(Boolean).join(" – ")}</p>
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
