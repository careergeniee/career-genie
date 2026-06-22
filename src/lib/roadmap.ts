import { aiJson } from "@/lib/ai";
import { uid8, todayKey, dayDiff } from "@/lib/userStore";
import { getStack, stackToPromptText, type StackGroup } from "@/lib/careerStacks";

export const GOALS = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Mobile App Developer",
    "Cloud Engineer",
    "Cybersecurity Analyst",
    "UI/UX Designer",
];

export interface RoadmapTask {
    id: string;
    text: string;
    done: boolean;
    resourceLabel?: string;
    resourceUrl?: string;
}

export interface RoadmapPhase {
    id: string;
    title: string;
    summary: string;
    weeks: number;
    tasks: RoadmapTask[];
}

export interface Roadmap {
    goal: string;
    currentSkills: string;
    createdAt: number;
    phases: RoadmapPhase[];
    completionDates: string[]; // YYYY-MM-DD days a task was completed (for streaks)
    techStack?: StackGroup[]; // curated technologies for this field
}

interface RawPhase {
    title: string;
    summary: string;
    weeks: number;
    tasks: { text: string; resourceLabel?: string; resourceUrl?: string }[];
}

/** Generate a personalized roadmap from a goal + the user's current skills. */
export async function generateRoadmap(
    goal: string,
    currentSkills: string
): Promise<Roadmap> {
    const stack = getStack(goal);

    const system =
        "You are a senior career mentor and curriculum designer. You build practical, " +
        "week-by-week learning roadmaps with real, well-known free resources.";

    // When we have a curated stack for this field, force the roadmap to cover
    // exactly those technologies (the full A-to-Z for the role) and nothing
    // unrelated. Otherwise, let the model infer the field's stack.
    const stackBlock = stack
        ? `This field requires the following technologies. Your roadmap MUST cover ALL of them, ` +
          `grouped logically and ordered from fundamentals to advanced, and MUST NOT include ` +
          `technologies that are unrelated to this field:\n${stackToPromptText(stack)}\n\n`
        : `Cover the complete technology stack required specifically for this field ` +
          `(from fundamentals through to job-ready), and do not include unrelated technologies.\n\n`;

    const user = `Create a learning roadmap to become a "${goal}".
${stackBlock}The learner already knows: ${currentSkills || "nothing specific / complete beginner"}.
Skip technologies they already know and start at the right level for them.

Return JSON:
{
  "phases": [
    {
      "title": "<phase name>",
      "summary": "<1 sentence on the goal of this phase>",
      "weeks": <integer number of weeks>,
      "tasks": [
        { "text": "<concrete task naming the specific technology>", "resourceLabel": "<resource name>", "resourceUrl": "<https url>" }
      ]
    }
  ]
}
Rules: 4 to 6 phases. 3 to 5 tasks per phase. Every technology listed above must
appear in at least one task (unless the learner already knows it). Use real, popular
free resources (MDN, freeCodeCamp, official docs, Coursera, YouTube). Use real https URLs.`;

    const res = await aiJson<{ phases: RawPhase[] }>(system, user, { maxTokens: 3000 });
    const phases: RoadmapPhase[] = (res.phases || []).map((p) => ({
        id: uid8(),
        title: p.title || "Phase",
        summary: p.summary || "",
        weeks: Number(p.weeks) || 1,
        tasks: (p.tasks || []).map((t) => ({
            id: uid8(),
            text: t.text || "",
            done: false,
            resourceLabel: t.resourceLabel,
            resourceUrl: t.resourceUrl,
        })),
    }));

    return {
        goal,
        currentSkills,
        createdAt: Date.now(),
        phases,
        completionDates: [],
        techStack: stack ?? undefined,
    };
}

export const phaseProgress = (p: RoadmapPhase) => {
    if (p.tasks.length === 0) return 0;
    return Math.round((p.tasks.filter((t) => t.done).length / p.tasks.length) * 100);
};

export const totalProgress = (r: Roadmap) => {
    const all = r.phases.flatMap((p) => p.tasks);
    if (all.length === 0) return 0;
    return Math.round((all.filter((t) => t.done).length / all.length) * 100);
};

/** Current streak: consecutive days (ending today or yesterday) with a completion. */
export const currentStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;
    const uniq = Array.from(new Set(dates)).sort().reverse(); // newest first
    const today = todayKey();
    const gapFromToday = dayDiff(today, uniq[0]);
    if (gapFromToday > 1) return 0; // streak broken (last activity > 1 day ago)

    let streak = 1;
    for (let i = 0; i < uniq.length - 1; i++) {
        if (dayDiff(uniq[i], uniq[i + 1]) === 1) streak++;
        else break;
    }
    return streak;
};
