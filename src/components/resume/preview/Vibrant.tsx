import { ResumeData } from "@/lib/resume";
import { bullets, contact, VibrantSec } from "./shared";

export function Vibrant({ d }: { d: ResumeData }) {
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
