import { describe, it, expect } from "vitest";
import { bullets } from "@/components/resume/preview/shared";
import { splitBullets } from "@/components/resume/pdf/shared";

describe.each([
    ["bullets (preview)", bullets],
    ["splitBullets (pdf)", splitBullets],
])("%s", (_name, fn) => {
    it("strips leading markdown bullet markers the AI sometimes adds", () => {
        expect(fn("* Shipped feature X\n* Improved perf by 40%")).toEqual([
            "Shipped feature X",
            "Improved perf by 40%",
        ]);
    });

    it("strips leading dash and numbered markers", () => {
        expect(fn("- Did a thing\n1. Did another thing\n2) A third thing")).toEqual([
            "Did a thing",
            "Did another thing",
            "A third thing",
        ]);
    });

    it("leaves plain lines (no markers) untouched", () => {
        expect(fn("Built 12+ React components\nMentored 2 interns")).toEqual([
            "Built 12+ React components",
            "Mentored 2 interns",
        ]);
    });

    it("drops empty lines and trims whitespace", () => {
        expect(fn("  Line one  \n\n  * Line two  \n")).toEqual(["Line one", "Line two"]);
    });

    it("does not strip an asterisk that isn't a leading bullet marker", () => {
        expect(fn("Grew revenue by 40%* (adjusted for inflation)")).toEqual([
            "Grew revenue by 40%* (adjusted for inflation)",
        ]);
    });
});
