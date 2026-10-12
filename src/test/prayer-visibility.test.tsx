import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomeCards } from "@/components/home-cards";
import { SettingsPanel } from "@/components/settings-panel";
import { LocationPicker, MethodSelect, PrayerDetails, PrayerSummary } from "@/components/prayer-times";
import { SettingsProvider } from "@/lib/settings-context";
import { SETTINGS_KEY } from "@/lib/settings";
import { usePrayerTimes } from "@/lib/use-prayer-times";
import { fetchPrayerTimes } from "@/lib/prayer-times";
import type { ReactNode } from "react";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, className }: { children: ReactNode; to: string; className?: string }) =>
    <a href={to} className={className}>{children}</a>,
}));

const feature = vi.hoisted(() => ({ enabled: false }));
vi.mock("@/config/prieres", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/config/prieres")>();
  return { ...original, get AFFICHER_HORAIRES_CALCULES() { return feature.enabled; } };
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  feature.enabled = false;
});

function PrayerProbe() {
  const state = usePrayerTimes();
  return <><PrayerSummary state={state} /><PrayerDetails state={state} /></>;
}

describe("Calculated prayer visibility switch", () => {
  it("is disabled in the real configuration", async () => {
    const actual = await vi.importActual<typeof import("@/config/prieres")>("@/config/prieres");
    expect(actual.AFFICHER_HORAIRES_CALCULES).toBe(false);
  });

  it("disabled Home keeps exactly the three independent non-prayer cards", () => {
    render(<SettingsProvider><HomeCards /></SettingsProvider>);
    const cards = screen.getAllByRole("button");
    expect(cards).toHaveLength(3);
    expect(screen.queryByRole("button", { name: /Horaires de prière/ })).toBeNull();
    const sunna = screen.getByRole("button", { name: /Sunna du jour/ });
    const reminder = screen.getByRole("button", { name: /Rappel du jour/ });
    const learning = screen.getByRole("button", { name: /Ton apprentissage du jour/ });
    expect(cards).toEqual([sunna, reminder, learning]);
    fireEvent.click(sunna);
    fireEvent.click(reminder);
    expect(sunna).toHaveAttribute("aria-expanded", "true");
    expect(reminder).toHaveAttribute("aria-expanded", "true");
  });

  it("disabled settings and prayer primitives expose no controls even with a saved location", () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ location: { kind: "city", city: "Paris" }, method: 12 }));
    const gps = vi.fn();
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition: gps } });
    render(<SettingsProvider><SettingsPanel /><LocationPicker /><MethodSelect /><PrayerProbe /></SettingsProvider>);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("combobox")).toBeNull();
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.queryByText("Paris")).toBeNull();
    expect(gps).not.toHaveBeenCalled();
  });

  it("disabled hook and direct API function make no network calls for saved city or GPS", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ location: { kind: "city", city: "Paris" }, method: 12 }));
    render(<SettingsProvider><HomeCards /><SettingsPanel /><PrayerProbe /></SettingsProvider>);
    await expect(fetchPrayerTimes({ kind: "city", city: "Paris" }, new Date(), 12)).rejects.toThrow("désactivés");
    await expect(fetchPrayerTimes({ kind: "gps", latitude: 48.85, longitude: 2.35 }, new Date(), 12)).rejects.toThrow("désactivés");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("enabled switch restores all four cards, settings and API calls", async () => {
    feature.enabled = true;
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ code: 200, data: {
      timings: { Fajr: "06:55", Dhuhr: "13:38", Asr: "16:37", Maghrib: "19:11", Isha: "20:19" },
      meta: { timezone: "Europe/Paris" },
    } }) });
    vi.stubGlobal("fetch", fetch);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ location: { kind: "city", city: "Paris" }, method: 12 }));
    render(<SettingsProvider><HomeCards /><SettingsPanel /></SettingsProvider>);
    const prayerCard = screen.getByRole("button", { name: /Horaires de prière/ });
    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(4);
    expect(screen.getByRole("combobox")).toHaveValue("12");
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    fireEvent.click(prayerCard);
    await waitFor(() => expect(screen.getAllByRole("checkbox")).toHaveLength(5));
    expect(fetch.mock.calls[0]?.[0]).toContain("address=Paris&method=12");
  });
});