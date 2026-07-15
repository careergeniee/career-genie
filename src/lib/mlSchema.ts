/**
 * mlSchema.ts
 * ===========
 * Browser-side mirror of the Python model schema (ml-service/career_data.py).
 *
 * The FEATURE_ORDER here MUST match the Python file exactly, because the
 * frontend builds the same 21-value vector that the Random Forest was
 * trained on and sends it to the /predict endpoint. Career profile data
 * (used by the offline fallback scorer and skill-gap analysis) lives in
 * @/lib/careerCatalog.ts.
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

/** Human-readable labels for personality traits — shared by Careers.tsx and Chat.tsx. */
export const TRAIT_LABEL: Record<PersonalityKey, string> = {
    leadership: "Leadership",
    creativity: "Creativity",
    communication: "Communication",
    problem_solving: "Problem solving",
    analytical: "Analytical thinking",
    teamwork: "Teamwork",
};

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

/** Human-readable label for any of the 21 model features (traits + skills combined). */
export const FEATURE_LABEL: Record<FeatureKey, string> = {
    ...TRAIT_LABEL,
    ...Object.fromEntries(SKILLS.map((s) => [s, SKILL_META[s].label])),
} as Record<FeatureKey, string>;

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
