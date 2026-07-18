import { aiJson } from "@/lib/ai";
import { uid8 } from "@/lib/userStore";

export const ROLES = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Data Analyst",
    "DevOps Engineer",
    "Mobile App Developer",
    "UI/UX Designer",
    "Product Manager",
    "QA Engineer",
    "Machine Learning Engineer",
];

export type Difficulty = "entry" | "mid" | "senior";

export const DIFFICULTIES: { id: Difficulty; label: string }[] = [
    { id: "entry", label: "Entry level" },
    { id: "mid", label: "Mid level" },
    { id: "senior", label: "Senior" },
];

export interface Answer {
    question: string;
    answer: string;
    score: number; // 0-10
    feedback: string;
    idealPoints: string[];
    timeUsed: number; // seconds
}

export interface InterviewSession {
    id: string;
    role: string;
    difficulty: Difficulty;
    date: number; // timestamp
    questions: string[];
    answers: Answer[];
    overallScore: number; // 0-100, computed when finished
    finished: boolean;
}

/** Ask the AI for 10 role-specific interview questions. */
export async function generateQuestions(
    role: string,
    difficulty: Difficulty
): Promise<string[]> {
    const system =
        "You are a senior technical interviewer. You produce realistic interview questions.";
    const user = `Generate exactly 10 interview questions for a ${difficulty}-level "${role}" position.
Mix behavioral and technical/role-specific questions appropriate to the level.
Return JSON: { "questions": ["q1", "q2", ... 10 total ] }
Each question is a single clear sentence.`;

    const res = await aiJson<{ questions: string[] }>(system, user, { maxTokens: 1200 });
    // aiJson only guarantees the response parses as JSON, not that its fields
    // match the requested shape -- filter(Boolean) let any truthy non-string
    // (e.g. a nested object) through, which later crashes when rendered as a
    // JSX child (`{session.questions[qIndex]}` in InterviewSession.tsx).
    const qs = Array.isArray(res.questions)
        ? res.questions.filter((q): q is string => typeof q === "string" && q.trim().length > 0)
        : [];
    return qs.slice(0, 10);
}

/** Evaluate a single answer and return a 0-10 score with feedback. */
export async function evaluateAnswer(
    role: string,
    difficulty: Difficulty,
    question: string,
    answer: string
): Promise<Pick<Answer, "score" | "feedback" | "idealPoints">> {
    if (!answer.trim()) {
        return {
            score: 0,
            feedback: "No answer was provided.",
            idealPoints: ["Attempt an answer — even a structured outline earns partial credit."],
        };
    }

    const system =
        "You are a fair but rigorous interview coach. You evaluate candidate answers and " +
        "return structured JSON feedback. Be specific and constructive.";
    const user = `Role: ${role} (${difficulty} level).
Question: "${question}"
Candidate's answer: "${answer}"

Evaluate the answer. Return JSON:
{
  "score": <integer 0-10>,
  "feedback": "<2-3 sentences: what was good, what to improve>",
  "idealPoints": ["<key point a strong answer would cover>", ...]
}`;

    const res = await aiJson<{ score: number; feedback: string; idealPoints: string[] }>(
        system,
        user,
        { maxTokens: 700 }
    );
    // Same "aiJson guarantees valid JSON, not the requested shape" gap as
    // above. Two failure modes guarded against:
    //   - `res.score` malformed (e.g. "8/10", null) -> Number(...) is NaN.
    //     `NaN || 0` used to silently misgrade a real answer to the worst
    //     possible score with no error; a malformed response isn't evidence
    //     of a bad answer, so it now falls back to a neutral middle score
    //     instead of the harshest one.
    //   - `feedback`/`idealPoints` entries non-string (e.g. a nested object)
    //     -> flows into fields typed `string`/`string[]`, then crashes when
    //     rendered as a JSX child. Worse here than in generateQuestions
    //     because this result gets persisted into the session's saved
    //     answers (Interview.tsx), so a corrupted entry crashes every time
    //     the user reopens "Review" on that past session, not just once.
    const rawScore = Number(res.score);
    return {
        score: Number.isFinite(rawScore) ? Math.max(0, Math.min(10, Math.round(rawScore))) : 5,
        feedback: typeof res.feedback === "string" ? res.feedback : "",
        idealPoints: Array.isArray(res.idealPoints)
            ? res.idealPoints.filter((p): p is string => typeof p === "string")
            : [],
    };
}

export const newSession = (role: string, difficulty: Difficulty, questions: string[]): InterviewSession => ({
    id: uid8(),
    role,
    difficulty,
    date: Date.now(),
    questions,
    answers: [],
    overallScore: 0,
    finished: false,
});
