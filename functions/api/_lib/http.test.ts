import { describe, it, expect } from "vitest";
import { jsonResponse } from "./http";

describe("jsonResponse", () => {
    it("sets the status code and a JSON content-type header", async () => {
        const res = jsonResponse(201, { hello: "world" });
        expect(res.status).toBe(201);
        expect(res.headers.get("Content-Type")).toBe("application/json");
        expect(await res.json()).toEqual({ hello: "world" });
    });
});
