/**
 * instructor.ts
 * =============
 * The "Senior Instructor" — a career-matched senior professional who mentors
 * the user with full awareness of their profile (assessment, career match,
 * skill gaps, and roadmap progress).
 *
 * Capabilities:
 *   - persona matched to the user's target career
 *   - context-aware mentor chat
 *   - skill quizzes (scored) on field-relevant topics
 *   - structured progress reviews
 *   - daily assigned tasks with streaks + reminder/alarm support
 */

import { aiText, aiJson } from "@/lib/ai";
import { loadData, saveData, uid8, todayKey, dayDiff, KEYS } from "@/lib/userStore";
import { loadAssessment, loadPrediction, analyzeSkillGap, traitScore } from "@/lib/careerEngine";
import { PERSONALITY, type PersonalityKey } from "@/lib/mlSchema";
import { getStack, flattenStack } from "@/lib/careerStacks";
import { totalProgress, type Roadmap } from "@/lib/roadmap";

// -------------------------------------------------------------------------
// Persona
// -------------------------------------------------------------------------

export interface Persona {
    name: string;
    title: string;
    tagline: string;
}

const PERSONA_NAMES: Record<string, string> = {
    "Data Scientist": "Dr. Aisha Khan",
    "Machine Learning Engineer": "Omar Farooq",
    "Data Analyst": "Hina Raza",
    "Frontend Developer": "Daniyal Ahmed",
    "Backend Developer": "Bilal Saeed",
    "Full Stack Developer": "Zara Malik",
    "Cybersecurity Analyst": "Usman Tariq",
    "Cloud / DevOps Engineer": "Sana Iqbal",
    "DevOps Engineer": "Sana Iqbal",
    "Cloud Engineer": "Sana Iqbal",
    "Mobile App Developer": "Hamza Sheikh",
    "UI/UX Designer": "Mariam Yousaf",
};

/** A senior-professional persona matched to the target career. */
export function personaFor(career: string | null): Persona {
    if (!career) {
        return {
            name: "Imran Aziz",
            title: "Senior Career Mentor",
            tagline: "10+ years guiding students into tech careers.",
        };
    }
    const role = career.replace("Cloud / DevOps Engineer", "Cloud / DevOps Engineer");
    return {
        name: PERSONA_NAMES[career] || "Imran Aziz",
        title: `Senior ${role}`,
        tagline: `A senior ${role.toLowerCase()} mentoring you toward this exact career.`,
    };
}

// -------------------------------------------------------------------------
// User context
// -------------------------------------------------------------------------

const TRAIT_LABEL: Record<PersonalityKey, string> = {
    leadership: "Leadership",
    creativity: "Creativity",
    communication: "Communication",
    problem_solving: "Problem solving",
    analytical: "Analytical thinking",
    teamwork: "Teamwork",
};

export interface UserContext {
    career: string | null;
    name: string;
    /** Compact natural-language summary injected into prompts. */
    summary: string;
    /** Field-relevant topics for quizzes. */
    topics: string[];
    roadmapProgress: number | null;
}

/** Gather everything the instructor knows about the user. */
export function buildUserContext(displayName?: string): UserContext {
    const assessment = loadAssessment();
    const prediction = loadPrediction();
    const roadmap = loadData<Roadmap | null>("roadmap", null);

    const career = roadmap?.goal || prediction?.topCareer || null;
    const name = (displayName || "").split(" ")[0] || "there";

    const lines: string[] = [];
    lines.push(`Student's name: ${name}.`);

    if (career) lines.push(`Target career: ${career}.`);
    else lines.push("Target career: not chosen yet (encourage taking the assessment).");

    if (prediction) {
        lines.push(
            `ML career match: ${prediction.topCareer} (${Math.round(
                (prediction.predictions[0]?.probability ?? 0) * 100
            )}% fit).`
        );
    }

    if (assessment) {
        const traits = PERSONALITY.map((t) => ({ t, s: traitScore(t, assessment.personalityAnswers) }))
            .sort((a, b) => b.s - a.s)
            .slice(0, 3)
            .map((x) => TRAIT_LABEL[x.t]);
        lines.push(`Strongest traits: ${traits.join(", ")}.`);
    }

    if (career && assessment) {
        const gap = analyzeSkillGap(career, assessment.skillRatings);
        const gaps = gap.filter((g) => g.status !== "strong").map((g) => g.label);
        const strong = gap.filter((g) => g.status === "strong").map((g) => g.label);
        if (strong.length) lines.push(`Already solid in: ${strong.join(", ")}.`);
        if (gaps.length) lines.push(`Needs to improve: ${gaps.join(", ")}.`);
    }

    let roadmapProgress: number | null = null;
    if (roadmap) {
        roadmapProgress = totalProgress(roadmap);
        const nextPhase = roadmap.phases.find((p) => p.tasks.some((t) => !t.done));
        lines.push(
            `Roadmap progress: ${roadmapProgress}% complete` +
                (nextPhase ? `, currently around "${nextPhase.title}".` : ".")
        );
    } else {
        lines.push("No learning roadmap generated yet.");
    }

    // Topics for quizzes: from the field's tech stack + current skill gaps.
    const topics = new Set<string>();
    const stack = career ? getStack(career) : null;
    if (stack) flattenStack(stack).forEach((t) => topics.add(t));
    if (career && assessment) {
        analyzeSkillGap(career, assessment.skillRatings)
            .filter((g) => g.status !== "strong")
            .forEach((g) => topics.add(g.label));
    }

    return { career, name, summary: lines.join("\n"), topics: [...topics], roadmapProgress };
}

function systemPersona(persona: Persona, ctx: UserContext): string {
    return (
        `You are ${persona.name}, a ${persona.title} with over a decade of real industry ` +
        `experience. You are mentoring a student one-on-one. Be warm but direct, practical, ` +
        `and specific. Speak in first person as the mentor. Use the student's context below ` +
        `to personalize everything; never give generic advice when you can tie it to their ` +
        `situation.\n\n--- STUDENT CONTEXT ---\n${ctx.summary}\n--- END CONTEXT ---`
    );
}

// -------------------------------------------------------------------------
// Daily task
// -------------------------------------------------------------------------

export interface DailyTask {
    id: string;
    date: string; // YYYY-MM-DD
    text: string;
    topic: string;
    why: string;
    estMinutes: number;
    done: boolean;
    completedAt?: number;
}

/** Generate today's task, tied to the roadmap / biggest skill gap. */
export async function generateDailyTask(
    persona: Persona,
    ctx: UserContext
): Promise<DailyTask> {
    const res = await aiJson<{ text: string; topic: string; why: string; estMinutes: number }>(
        systemPersona(persona, ctx),
        `Assign ONE concrete learning task for the student to do TODAY that moves them toward ` +
            `becoming a ${ctx.career || "tech professional"}. It should take 20-45 minutes, be ` +
            `specific and doable in one sitting, and target their current roadmap phase or biggest ` +
            `skill gap. Return JSON: {"text": "<the task, imperative voice>", "topic": "<1-3 word topic>", ` +
            `"why": "<1 sentence on why this matters for them>", "estMinutes": <integer>}`,
        { maxTokens: 400, temperature: 0.7 }
    );
    return {
        id: uid8(),
        date: todayKey(),
        text: res.text || "Spend 30 minutes practicing your weakest skill.",
        topic: res.topic || "Practice",
        why: res.why || "",
        estMinutes: Number(res.estMinutes) || 30,
        done: false,
    };
}

// -------------------------------------------------------------------------
// Quiz
// -------------------------------------------------------------------------

export interface QuizQuestion {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
}

/** Generate a 5-question multiple-choice quiz on a topic. */
export async function generateQuiz(
    topic: string,
    persona: Persona,
    ctx: UserContext
): Promise<QuizQuestion[]> {
    const res = await aiJson<{ questions: QuizQuestion[] }>(
        systemPersona(persona, ctx),
        `Create a 5-question multiple-choice quiz to test the student's understanding of ` +
            `"${topic}" at the level expected for a ${ctx.career || "tech professional"}. ` +
            `Each question has exactly 4 options, one correct. Return JSON: ` +
            `{"questions":[{"question":"...","options":["a","b","c","d"],"answerIndex":<0-3>,` +
            `"explanation":"<why the answer is correct>"}]}`,
        { maxTokens: 1800, temperature: 0.5 }
    );
    return (res.questions || [])
        .filter((q) => q.options?.length === 4 && q.answerIndex >= 0 && q.answerIndex < 4)
        .slice(0, 5);
}

// -------------------------------------------------------------------------
// Progress review
// -------------------------------------------------------------------------

export interface ProgressReview {
    grade: string;
    summary: string;
    doingWell: string[];
    focusNext: string[];
    nextMilestone: string;
}

/** A structured review of where the student stands. */
export async function reviewProgress(
    persona: Persona,
    ctx: UserContext
): Promise<ProgressReview> {
    const res = await aiJson<ProgressReview>(
        systemPersona(persona, ctx),
        `Give the student an honest progress review as their mentor. Return JSON: ` +
            `{"grade":"<letter grade like B+ reflecting effort & readiness>","summary":"<2-3 ` +
            `sentences>","doingWell":["...","..."],"focusNext":["...","..."],"nextMilestone":` +
            `"<the single most important next milestone>"}`,
        { maxTokens: 700, temperature: 0.6 }
    );
    return {
        grade: res.grade || "—",
        summary: res.summary || "",
        doingWell: res.doingWell || [],
        focusNext: res.focusNext || [],
        nextMilestone: res.nextMilestone || "",
    };
}

// -------------------------------------------------------------------------
// Mentor chat
// -------------------------------------------------------------------------

export interface ChatMsg {
    role: "user" | "assistant";
    content: string;
}

export async function instructorChat(
    history: ChatMsg[],
    persona: Persona,
    ctx: UserContext
): Promise<string> {
    const transcript = history
        .map((m) => `${m.role === "user" ? "Student" : persona.name}: ${m.content}`)
        .join("\n");
    return aiText(
        systemPersona(persona, ctx) +
            "\n\nContinue the conversation as the mentor. Reply with ONLY your next message " +
            "(no name prefix). Keep it focused and conversational.",
        `${transcript}\n${persona.name}:`,
        { maxTokens: 700, temperature: 0.7 }
    );
}

// -------------------------------------------------------------------------
// Persistence
// -------------------------------------------------------------------------

export const loadTasks = () => loadData<DailyTask[]>(KEYS.instructorTasks, []);
export const saveTasks = (t: DailyTask[]) => saveData(KEYS.instructorTasks, t);
export const loadChat = () => loadData<ChatMsg[]>(KEYS.instructorChat, []);
export const saveChat = (m: ChatMsg[]) => saveData(KEYS.instructorChat, m);
export const loadReminderTime = () => loadData<string>(KEYS.instructorReminder, "18:00");
export const saveReminderTime = (t: string) => saveData(KEYS.instructorReminder, t);
export const loadLastNotified = () => loadData<string>(KEYS.instructorLastNotified, "");
export const saveLastNotified = (d: string) => saveData(KEYS.instructorLastNotified, d);

export const getTodayTask = (tasks: DailyTask[]): DailyTask | undefined =>
    tasks.find((t) => t.date === todayKey());

/** True when today has a task that is still not done. */
export const hasPendingTaskToday = (tasks: DailyTask[]): boolean => {
    const t = getTodayTask(tasks);
    return !!t && !t.done;
};

/** Consecutive days (ending today or yesterday) with a completed task. */
export const taskStreak = (tasks: DailyTask[]): number => {
    const doneDates = Array.from(
        new Set(tasks.filter((t) => t.done).map((t) => t.date))
    ).sort().reverse();
    if (doneDates.length === 0) return 0;
    if (dayDiff(todayKey(), doneDates[0]) > 1) return 0;
    let streak = 1;
    for (let i = 0; i < doneDates.length - 1; i++) {
        if (dayDiff(doneDates[i], doneDates[i + 1]) === 1) streak++;
        else break;
    }
    return streak;
};

/** How many days in the recent past had a task that was never completed. */
export const missedTaskCount = (tasks: DailyTask[]): number =>
    tasks.filter((t) => !t.done && dayDiff(todayKey(), t.date) >= 1).length;
