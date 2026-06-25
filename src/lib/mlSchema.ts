/**
 * mlSchema.ts
 * ===========
 * Browser-side mirror of the Python model schema (ml-service/career_data.py).
 *
 * The FEATURE_ORDER here MUST match the Python file exactly, because the
 * frontend builds the same 21-value vector that the Random Forest was
 * trained on and sends it to the /predict endpoint. The same ideal-profile
 * data also powers the offline fallback scorer and the skill-gap analysis.
 */

export const PERSONALITY = [
    "leadership",
    "creativity",
    "communication",
    "problem_solving",
    "analytical",
    "teamwork",
] as const;

export const SKILLS = [
    "python",
    "javascript",
    "sql",
    "statistics",
    "machine_learning",
    "data_visualization",
    "html_css",
    "react",
    "backend_apis",
    "databases",
    "cloud",
    "networking_security",
    "linux_devops",
    "mobile_dev",
    "ui_ux_design",
] as const;

export type PersonalityKey = (typeof PERSONALITY)[number];
export type SkillKey = (typeof SKILLS)[number];
export type FeatureKey = PersonalityKey | SkillKey;

/** Identical order to career_data.py FEATURE_ORDER. */
export const FEATURE_ORDER: FeatureKey[] = [...PERSONALITY, ...SKILLS];

export const BASELINE = 0.10;

/** Human-readable labels + grouping for the skill self-rating UI. */
export const SKILL_META: Record<
    SkillKey,
    { label: string; category: string }
> = {
    python: { label: "Python", category: "Programming" },
    javascript: { label: "JavaScript", category: "Programming" },
    sql: { label: "SQL", category: "Data & ML" },
    statistics: { label: "Statistics & Probability", category: "Data & ML" },
    machine_learning: { label: "Machine Learning", category: "Data & ML" },
    data_visualization: { label: "Data Visualization", category: "Data & ML" },
    html_css: { label: "HTML & CSS", category: "Web" },
    react: { label: "React / Frontend", category: "Web" },
    backend_apis: { label: "Backend & APIs", category: "Web" },
    databases: { label: "Databases", category: "Web" },
    cloud: { label: "Cloud (AWS/Azure/GCP)", category: "Infrastructure" },
    networking_security: { label: "Networking & Security", category: "Infrastructure" },
    linux_devops: { label: "Linux & DevOps", category: "Infrastructure" },
    mobile_dev: { label: "Mobile Development", category: "Web" },
    ui_ux_design: { label: "UI/UX Design", category: "Design" },
};

export const SKILL_CATEGORIES = [
    "Programming",
    "Data & ML",
    "Web",
    "Infrastructure",
    "Design",
] as const;

/**
 * Personality questionnaire. Each statement is answered on a 1-5 Likert
 * scale; answers for the same trait are averaged and scaled to 0..1.
 */
export interface PersonalityQuestion {
    id: string;
    trait: PersonalityKey;
    text: string;
}

export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
    { id: "ld1", trait: "leadership", text: "I enjoy taking the lead and being responsible for a team's results." },
    { id: "ld2", trait: "leadership", text: "People often look to me to make decisions in a group." },
    { id: "cr1", trait: "creativity", text: "I love coming up with original ideas, designs, or approaches." },
    { id: "cr2", trait: "creativity", text: "I get bored doing the same thing the same way every time." },
    { id: "cm1", trait: "communication", text: "I can explain complex ideas clearly to people who aren't experts." },
    { id: "cm2", trait: "communication", text: "I'm comfortable presenting and writing for an audience." },
    { id: "ps1", trait: "problem_solving", text: "I enjoy breaking hard problems into smaller pieces and solving them." },
    { id: "ps2", trait: "problem_solving", text: "I keep going at a tough bug or puzzle until I crack it." },
    { id: "an1", trait: "analytical", text: "I like working with data, numbers, and logical reasoning." },
    { id: "an2", trait: "analytical", text: "I prefer decisions backed by evidence over gut feeling." },
    { id: "tm1", trait: "teamwork", text: "I do my best work collaborating with others toward a shared goal." },
    { id: "tm2", trait: "teamwork", text: "I value other people's input and adjust my plans based on it." },
];

/**
 * Career catalogue mirrored from career_data.py CAREERS.
 * Only features that matter for a role are listed; the rest are BASELINE.
 * Used by: (1) the offline fallback scorer, (2) skill-gap analysis.
 */
// Career profiles sourced from O*NET occupational database (onetonline.org).
// Personality values = O*NET Work Styles (standardised 0-100 → 0-1).
// Technical values = O*NET Technology Skills + Knowledge ratings.
export const CAREERS: Record<string, Partial<Record<FeatureKey, number>>> = {
    // 15-2051.00 — Data Scientists
    "Data Scientist": {
        analytical: 0.94, problem_solving: 0.88, creativity: 0.88,
        communication: 0.76, teamwork: 0.79,
        python: 0.90, statistics: 0.92, machine_learning: 0.88,
        sql: 0.76, data_visualization: 0.80,
        databases: 0.58, cloud: 0.52, linux_devops: 0.50,
    },
    // 15-2051.00 / 15-1299.09 — Machine Learning Engineers
    "Machine Learning Engineer": {
        analytical: 0.92, problem_solving: 0.90, creativity: 0.82, teamwork: 0.75,
        python: 0.94, machine_learning: 0.94, statistics: 0.82,
        backend_apis: 0.70, cloud: 0.68, linux_devops: 0.65, databases: 0.55,
    },
    // 15-2041.00 / 15-1211.00 — Data Analysts
    "Data Analyst": {
        analytical: 0.90, communication: 0.82, problem_solving: 0.72,
        creativity: 0.65, teamwork: 0.72,
        sql: 0.92, data_visualization: 0.92, statistics: 0.80,
        python: 0.65, databases: 0.68,
    },
    // 15-1254.00 — Web Developers (Frontend)
    "Frontend Developer": {
        creativity: 0.84, analytical: 0.72, problem_solving: 0.70,
        communication: 0.66, teamwork: 0.75,
        javascript: 0.92, html_css: 0.94, react: 0.88, ui_ux_design: 0.72,
    },
    // 15-1252.00 — Software Developers (Backend)
    "Backend Developer": {
        analytical: 0.82, problem_solving: 0.86, creativity: 0.72, teamwork: 0.70,
        backend_apis: 0.92, databases: 0.88, sql: 0.80,
        python: 0.72, javascript: 0.58, linux_devops: 0.62, cloud: 0.58,
    },
    // 15-1254.00 + 15-1252.00 composite — Full Stack Developers
    "Full Stack Developer": {
        analytical: 0.75, problem_solving: 0.80, creativity: 0.76,
        communication: 0.68, teamwork: 0.74,
        javascript: 0.88, html_css: 0.82, react: 0.84,
        backend_apis: 0.84, databases: 0.78, sql: 0.70, cloud: 0.55,
    },
    // 15-1212.00 — Information Security Analysts
    "Cybersecurity Analyst": {
        analytical: 0.90, problem_solving: 0.88, creativity: 0.75,
        communication: 0.72, leadership: 0.64,
        networking_security: 0.94, linux_devops: 0.78,
        python: 0.62, cloud: 0.60, databases: 0.52,
    },
    // 15-1244.00 / 15-1299.08 — Cloud & DevOps Engineers
    "Cloud / DevOps Engineer": {
        analytical: 0.78, problem_solving: 0.82, creativity: 0.70, teamwork: 0.72,
        cloud: 0.94, linux_devops: 0.94, networking_security: 0.72,
        backend_apis: 0.65, databases: 0.58, python: 0.60,
    },
    // 15-1252.00 specialised — Mobile App Developers
    "Mobile App Developer": {
        creativity: 0.78, problem_solving: 0.75, analytical: 0.70, teamwork: 0.68,
        mobile_dev: 0.96, javascript: 0.70, react: 0.62,
        ui_ux_design: 0.65, backend_apis: 0.58,
    },
    // 15-1255.00 — Web & Digital Interface Designers (UI/UX)
    "UI/UX Designer": {
        creativity: 0.92, communication: 0.84, teamwork: 0.84,
        problem_solving: 0.65, analytical: 0.60,
        ui_ux_design: 0.96, html_css: 0.68, javascript: 0.52,
    },
};

export const CAREER_LABELS = Object.keys(CAREERS);

/** Short blurb per career for result cards. */
export const CAREER_BLURB: Record<string, string> = {
    "Data Scientist": "Turn data into insight with statistics, ML, and storytelling.",
    "Machine Learning Engineer": "Build and ship ML systems that learn from data at scale.",
    "Data Analyst": "Find patterns in data and communicate them with clear visuals.",
    "Frontend Developer": "Craft fast, polished user interfaces for the web.",
    "Backend Developer": "Design the servers, APIs, and databases behind the app.",
    "Full Stack Developer": "Own features end to end, from UI to database.",
    "Cybersecurity Analyst": "Defend systems and data from attacks and breaches.",
    "Cloud / DevOps Engineer": "Automate infrastructure and keep deployments reliable.",
    "Mobile App Developer": "Build native and cross-platform mobile experiences.",
    "UI/UX Designer": "Design intuitive, beautiful product experiences.",
};

/** Expand a sparse career profile into the full ordered vector. */
export function idealVector(career: string): number[] {
    const profile = CAREERS[career] || {};
    return FEATURE_ORDER.map((f) => profile[f] ?? BASELINE);
}
