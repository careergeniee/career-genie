import { ResumeData } from "@/lib/resume";
import { bullets, contact, ClassicSec } from "./shared";

export function Classic({ d }: { d: ResumeData }) {
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
                            {p.link && <p className="text-[11px] text-[#444] break-words">{p.link}</p>}
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
