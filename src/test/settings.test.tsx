import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MethodSelect } from "@/components/prayer-times";
import { APP_SETTING_ID } from "@/config/prieres";
import { SETTINGS_KEY } from "@/lib/settings";
import { SettingsProvider } from "@/lib/settings-context";
import { usePrayerTimes } from "@/lib/use-prayer-times";

vi.mock("@/config/prieres", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/config/prieres")>(),
  AFFICHER_HORAIRES_CALCULES: true,
}));

afterEach(() => { cleanup(); localStorage.clear(); });

function HomeMethodProbe() {
  const { method } = usePrayerTimes();
  return <output data-testid="home-method">{method}</output>;
}

describe("Shared settings", () => {
  it("defaults to the app setting", async () => {
    render(<SettingsProvider><MethodSelect /><HomeMethodProbe /></SettingsProvider>);
    expect((await screen.findByTestId("home-method")).textContent).toBe(String(APP_SETTING_ID));
  });

  it("changing the method in Settings changes the value used by Home and is saved under one key", async () => {
    render(<SettingsProvider><MethodSelect /><HomeMethodProbe /></SettingsProvider>);
    fireEvent.change(screen.getByLabelText("Méthode de calcul des prières"), { target: { value: "3" } });
    expect(screen.getByTestId("home-method").textContent).toBe("3");
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null")).toEqual({ location: null, method: 3 });
  });
});
