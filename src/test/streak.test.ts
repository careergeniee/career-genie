import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { streakFromDates, todayKey } from "@/lib/userStore";

describe("streakFromDates", () => {
    it("returns 0 for no dates", () => {
        expect(streakFromDates([])).toBe(0);
    });
    it("returns 1 for a single date today", () => {
        expect(streakFromDates([todayKey()])).toBe(1);
    });
    it("counts consecutive days ending today", () => {
        const d0 = new Date();
        const d1 = new Date(d0); d1.setDate(d0.getDate() - 1);
        const d2 = new Date(d0); d2.setDate(d0.getDate() - 2);
        const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        expect(streakFromDates([fmt(d2), fmt(d1), fmt(d0)])).toBe(3);
    });
    it("returns 0 if the most recent date is more than 1 day old", () => {
        const old = new Date();
        old.setDate(old.getDate() - 5);
        const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        expect(streakFromDates([fmt(old)])).toBe(0);
    });
});
