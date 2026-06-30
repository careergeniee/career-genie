import { ResumeData } from "@/lib/resume";

/* Resumes print on white paper, so these styles are intentionally light —
   they do NOT use the dark dashboard theme. Only built-in PDF fonts are used
   (Helvetica / Times-Roman) so generation never depends on a network fetch. */

export const ACCENT = "#1f6feb"; // modern accent
export const INK = "#1a1a1a";
export const SUB = "#444444";
export const PURPLE = "#4f46e5";
export const PURPLE_LIGHT = "#ede9fe";
export const NAVY = "#0a2540";
export const GOLD = "#c9a227";
export const TEAL = "#0d9488";
export const CORAL = "#ea580c";

export const splitBullets = (s: string) =>
    s
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean);

export const contactLine = (p: ResumeData["personal"]) =>
    [p.email, p.phone, p.location, p.website].filter(Boolean).join("  •  ");
