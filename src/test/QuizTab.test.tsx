import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { Persona, UserContext } from "@/lib/instructor";

const generateQuizMock = vi.fn();
vi.mock("@/lib/instructor", () => ({
    generateQuiz: (...args: unknown[]) => generateQuizMock(...args),
}));

import { QuizTab } from "@/pages/dashboard/instructor/QuizTab";

const persona: Persona = { name: "Mentor", title: "Senior Mentor", tagline: "" };
const ctx: UserContext = {
    career: "Frontend Developer",
    name: "Taha",
    summary: "",
    topics: [],
    roadmapProgress: null,
};

describe("QuizTab", () => {
    it("does not start a second overlapping quiz request while one is already in flight", () => {
        // Regression test: the topic <input>'s Enter handler used to be
        // ungated by `loading` -- unlike the suggestion chips and "Quiz me"
        // button, which were already `disabled={loading}`. A fast
        // retype-and-resubmit (Enter, edit field, Enter again) before the
        // first generateQuiz() call resolved started a second, overlapping
        // request; whichever promise happened to resolve last won the
        // setQuestions() write, which could leave the displayed topic
        // mismatched with a different topic's questions.
        generateQuizMock.mockImplementation(() => new Promise(() => {})); // never resolves -- stays "in flight"

        render(<QuizTab persona={persona} ctx={ctx} />);
        const input = screen.getByPlaceholderText(/type any topic/i);

        fireEvent.change(input, { target: { value: "React hooks" } });
        fireEvent.keyDown(input, { key: "Enter" });
        expect(generateQuizMock).toHaveBeenCalledTimes(1);

        fireEvent.change(input, { target: { value: "SQL joins" } });
        fireEvent.keyDown(input, { key: "Enter" });
        expect(generateQuizMock).toHaveBeenCalledTimes(1); // still 1 -- second Enter was ignored while loading
    });
});
