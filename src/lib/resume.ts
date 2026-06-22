import { aiJson } from "@/lib/ai";
import { uid8 } from "@/lib/userStore";

export interface Personal {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
}

export interface EducationItem {
    id: string;
    school: string;
    degree: string;
    start: string;
    end: string;
    detail: string;
}

export interface ExperienceItem {
    id: string;
    company: string;
    role: string;
    start: string;
    end: string;
    bullets: string; // newline-separated
}

export interface ProjectItem {
    id: string;
    name: string;
    link: string;
    description: string;
}

export interface ResumeData {
    personal: Personal;
    education: EducationItem[];
    experience: ExperienceItem[];
    skills: string[];
    projects: ProjectItem[];
}

export type TemplateId = "modern" | "classic" | "minimal";

export const TEMPLATES: { id: TemplateId; label: string; blurb: string }[] = [
    { id: "modern", label: "Modern", blurb: "Accent sidebar, bold name" },
    { id: "classic", label: "Classic", blurb: "Centered, serif, formal" },
    { id: "minimal", label: "Minimal", blurb: "Clean lines, lots of air" },
];

export const newEducation = (): EducationItem => ({
    id: uid8(),
    school: "",
    degree: "",
    start: "",
    end: "",
    detail: "",
});

export const newExperience = (): ExperienceItem => ({
    id: uid8(),
    company: "",
    role: "",
    start: "",
    end: "",
    bullets: "",
});

export const newProject = (): ProjectItem => ({
    id: uid8(),
    name: "",
    link: "",
    description: "",
});

export const emptyResume = (name = "", email = ""): ResumeData => ({
    personal: {
        fullName: name,
        title: "",
        email,
        phone: "",
        location: "",
        website: "",
        summary: "",
    },
    education: [newEducation()],
    experience: [newExperience()],
    skills: [],
    projects: [newProject()],
});

/** A filled-in sample so the preview is never blank on first open. */
export const sampleResume = (): ResumeData => ({
    personal: {
        fullName: "Ayesha Khan",
        title: "Frontend Developer",
        email: "ayesha.khan@email.com",
        phone: "+92 300 1234567",
        location: "Lahore, Pakistan",
        website: "github.com/ayeshak",
        summary:
            "Frontend developer with 2 years building responsive React apps. Passionate about accessible UI, clean code, and shipping fast.",
    },
    education: [
        {
            id: uid8(),
            school: "University of the Punjab",
            degree: "BS Computer Science",
            start: "2019",
            end: "2023",
            detail: "CGPA 3.6 / 4.0 · Dean's List",
        },
    ],
    experience: [
        {
            id: uid8(),
            company: "TechHive Solutions",
            role: "Frontend Developer",
            start: "2023",
            end: "Present",
            bullets:
                "Built 12+ React components used across 3 products\nImproved page load time by 40% via code splitting\nMentored 2 junior interns on Git and testing",
        },
    ],
    skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Git", "REST APIs"],
    projects: [
        {
            id: uid8(),
            name: "Career Genie",
            link: "github.com/ayeshak/career-genie",
            description:
                "AI-powered career platform with resume builder, mock interviews, and roadmaps.",
        },
    ],
});

export interface AtsResult {
    score: number; // 0-100
    summary: string;
    strengths: string[];
    improvements: string[];
    missingKeywords: string[];
}

/**
 * Score the resume against a target role/job description using the AI.
 * Returns an ATS-style 0-100 score plus actionable feedback.
 */
export async function scoreResume(
    resume: ResumeData,
    targetRole: string
): Promise<AtsResult> {
    const flat = `
Name: ${resume.personal.fullName}
Title: ${resume.personal.title}
Summary: ${resume.personal.summary}
Skills: ${resume.skills.join(", ")}
Experience:
${resume.experience
    .map((e) => `- ${e.role} at ${e.company} (${e.start}-${e.end}): ${e.bullets}`)
    .join("\n")}
Education:
${resume.education.map((e) => `- ${e.degree}, ${e.school} (${e.start}-${e.end})`).join("\n")}
Projects:
${resume.projects.map((p) => `- ${p.name}: ${p.description}`).join("\n")}
`.trim();

    const system =
        "You are an Applicant Tracking System (ATS) and senior technical recruiter. " +
        "Evaluate resumes objectively against a target role and return a JSON object.";

    const user = `Target role: "${targetRole || "general professional role"}".

Evaluate the resume below. Consider keyword match, action verbs, quantified impact, clarity, and completeness.

Return JSON with EXACTLY these keys:
{
  "score": <integer 0-100>,
  "summary": "<2 sentence overall verdict>",
  "strengths": ["<short point>", ...],
  "improvements": ["<short actionable point>", ...],
  "missingKeywords": ["<keyword the role expects but is missing>", ...]
}

Resume:
${flat}`;

    const res = await aiJson<AtsResult>(system, user, { maxTokens: 1200 });
    // Clamp + guard against malformed output.
    return {
        score: Math.max(0, Math.min(100, Math.round(Number(res.score) || 0))),
        summary: res.summary || "",
        strengths: Array.isArray(res.strengths) ? res.strengths : [],
        improvements: Array.isArray(res.improvements) ? res.improvements : [],
        missingKeywords: Array.isArray(res.missingKeywords) ? res.missingKeywords : [],
    };
}
