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

export const BASELINE = 0.22;

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
export const CAREERS: Record<string, Partial<Record<FeatureKey, number>>> = {
    "Data Scientist": {
        analytical: 0.9, problem_solving: 0.85, creativity: 0.55,
        python: 0.9, statistics: 0.9, machine_learning: 0.85,
        sql: 0.75, data_visualization: 0.8,
    },
    "Machine Learning Engineer": {
        analytical: 0.88, problem_solving: 0.88,
        python: 0.92, machine_learning: 0.92, statistics: 0.78,
        backend_apis: 0.65, cloud: 0.6, linux_devops: 0.55,
    },
    "Data Analyst": {
        analytical: 0.85, communication: 0.7,
        sql: 0.88, statistics: 0.72, data_visualization: 0.88, python: 0.55,
    },
    "Frontend Developer": {
        creativity: 0.75, problem_solving: 0.65,
        javascript: 0.88, html_css: 0.9, react: 0.88, ui_ux_design: 0.55,
    },
    "Backend Developer": {
        problem_solving: 0.8, analytical: 0.7,
        backend_apis: 0.9, databases: 0.85, sql: 0.78,
        python: 0.55, javascript: 0.55,
    },
    "Full Stack Developer": {
        problem_solving: 0.78, communication: 0.62,
        javascript: 0.82, html_css: 0.78, react: 0.8,
        backend_apis: 0.8, databases: 0.72, sql: 0.65,
    },
    "Cybersecurity Analyst": {
        analytical: 0.82, problem_solving: 0.8,
        networking_security: 0.92, linux_devops: 0.7,
        python: 0.55, databases: 0.5,
    },
    "Cloud / DevOps Engineer": {
        problem_solving: 0.78, analytical: 0.68,
        cloud: 0.9, linux_devops: 0.9, networking_security: 0.65,
        backend_apis: 0.6, databases: 0.55,
    },
    "Mobile App Developer": {
        creativity: 0.68, problem_solving: 0.72,
        mobile_dev: 0.92, javascript: 0.65, ui_ux_design: 0.55, backend_apis: 0.55,
    },
    "UI/UX Designer": {
        creativity: 0.92, communication: 0.75, teamwork: 0.68,
        ui_ux_design: 0.92, html_css: 0.55,
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
