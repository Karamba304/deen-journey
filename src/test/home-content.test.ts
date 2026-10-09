import { describe, expect, it } from "vitest";
import { sunnas } from "@/content/sunnas";
import { rappels } from "@/content/rappels";
import { lecons } from "@/content/lecons";

describe("Lot 2 content integrity", () => {
  it("keeps the sunna dataset empty", () => { expect(sunnas).toEqual([]); });
  it("keeps the reminder dataset empty", () => { expect(rappels).toEqual([]); });
  it("keeps the lesson and question dataset empty", () => { expect(lecons).toEqual([]); });
});