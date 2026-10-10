import { describe, expect, it } from "vitest";
import { CALCULATION_METHODS, DEFAULT_METHOD_ID } from "@/config/prieres";
import { buildPrayerUrl, cleanTime, computeNextPrayer, formatRemaining, parsePrayerResponse, validateCity } from "@/lib/prayer-times";

const timings = { Fajr: "06:55", Dhuhr: "13:38", Asr: "16:37", Maghrib: "19:11", Isha: "20:19" };
const date = new Date(2026, 9, 10);

describe("prayer times rules", () => {
  it("default method is 12 and ids 15 and 99 are excluded", () => {
    expect(DEFAULT_METHOD_ID).toBe(12);
    const ids = CALCULATION_METHODS.map((m) => m.id);
    expect(ids).not.toContain(15);
    expect(ids).not.toContain(99);
    expect(ids).toHaveLength(22);
  });
  it("builds the documented AlAdhan URLs", () => {
    expect(buildPrayerUrl({ kind: "city", city: "Paris" }, date, 12)).toBe("https://api.aladhan.com/v1/timingsByAddress/10-10-2026?address=Paris&method=12");
    expect(buildPrayerUrl({ kind: "gps", latitude: 48.85, longitude: 2.35 }, date, 3)).toBe("https://api.aladhan.com/v1/timings/10-10-2026?latitude=48.85&longitude=2.35&method=3");
  });
  it("keeps only HH:mm", () => {
    expect(cleanTime("05:12 (CEST)")).toBe("05:12");
    expect(cleanTime("bad")).toBeNull();
  });
  it("extracts only the five prayers and the meta timezone", () => {
    const parsed = parsePrayerResponse({ code: 200, data: { timings: { ...timings, Sunrise: "08:03", Imsak: "06:45" }, meta: { timezone: "Europe/Paris" } } });
    expect(Object.keys(parsed.timings)).toEqual(["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]);
    expect(parsed.timezone).toBe("Europe/Paris");
  });
  it("rejects empty city and more than 100 characters", () => {
    expect(validateCity("   ")).toBeNull();
    expect(validateCity("a".repeat(101))).toBeNull();
    expect(validateCity(" Paris ")).toBe("Paris");
  });
  it("next prayer after Isha is tomorrow's Fajr, or 'tomorrow' without time", () => {
    expect(computeNextPrayer(timings, 15 * 60, null)).toMatchObject({ key: "Asr", minutesLeft: 97, tomorrow: false });
    expect(computeNextPrayer(timings, 21 * 60, "06:56")).toMatchObject({ key: "Fajr", time: "06:56", minutesLeft: 3 * 60 + 6 * 60 + 56, tomorrow: true });
    expect(computeNextPrayer(timings, 21 * 60, null)).toMatchObject({ time: null, tomorrow: true });
  });
  it("formats remaining time", () => {
    expect(formatRemaining(85)).toBe("dans 1 h 25");
    expect(formatRemaining(25)).toBe("dans 25 min");
  });
});
