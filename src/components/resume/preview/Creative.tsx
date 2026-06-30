import { ResumeData } from "@/lib/resume";
import { bullets, contact, CreativeSec } from "./shared";

export function Creative({ d }: { d: ResumeData }) {
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
