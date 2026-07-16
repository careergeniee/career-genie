import { ResumeData } from "@/lib/resume";
import { bullets, contact, MinSec } from "./shared";

export function Minimal({ d }: { d: ResumeData }) {
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
                            <div className="flex justify-between gap-2">
                                <span className="text-[13px] font-bold">{p.name}</span>
                                {p.link && <span className="text-[10px] text-gray-400 break-words min-w-0 text-right">{p.link}</span>}
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
