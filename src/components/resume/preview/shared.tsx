import React from "react";
import { ResumeData } from "@/lib/resume";

export const bullets = (s: string) =>
    s.split("\n").map((b) => b.trim()).filter(Boolean);

export const contact = (p: ResumeData["personal"]) =>
    [p.email, p.phone, p.location, p.website].filter(Boolean);

export const Section = ({ title, dark, children }: { title: string; dark?: boolean; children: React.ReactNode }) => (
    <div className="mb-4">
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${dark ? "text-[#9fd0ff]" : "text-[#1f6feb]"}`}>
            {title}
        </p>
        {children}
    </div>
);

export const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4">
        <p className="text-[12px] font-bold uppercase tracking-wider text-[#1f6feb] mb-2">{title}</p>
        {children}
    </div>
);

export const ClassicSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-3">
        <p className="text-[12px] font-bold uppercase tracking-wide border-b border-black pb-0.5 mb-2">{title}</p>
        {children}
    </div>
);

export const MinSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">{title}</p>
        {children}
    </div>
);

export const CreativeSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full bg-[#4f46e5]" />
            <p className="text-[13px] font-bold uppercase tracking-wide text-[#4f46e5]">{title}</p>
        </div>
        {children}
    </div>
);

export const ExecSideSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#c9a227] mb-2.5">{title}</p>
        {children}
    </div>
);

export const ExecMainSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
        <p className="text-[13px] font-bold uppercase tracking-widest text-[#0a2540] mb-1">{title}</p>
        <div className="h-[2.5px] bg-[#c9a227] mb-4" />
        {children}
    </div>
);

export const VibrantSec = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
            <p className="text-[13px] font-bold uppercase tracking-wide text-[#ea580c]">{title}</p>
            <div className="flex-1 h-px bg-[#fed7aa]" />
        </div>
        {children}
    </div>
);
