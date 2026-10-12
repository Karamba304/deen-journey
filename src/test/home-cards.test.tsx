import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomeCards } from "@/components/home-cards";
import { SettingsProvider } from "@/lib/settings-context";

vi.mock("@/config/prieres", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/config/prieres")>(),
  AFFICHER_HORAIRES_CALCULES: true,
}));

afterEach(cleanup);

describe("Independent Home card state", () => {
  it("starts all four cards closed", () => {
    render(<SettingsProvider><HomeCards /></SettingsProvider>);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
    buttons.forEach((button) => expect(button).toHaveAttribute("aria-expanded", "false"));
  });

  it("opening and closing one card does not close another", () => {
    render(<SettingsProvider><HomeCards /></SettingsProvider>);
    const prayers = screen.getByRole("button", { name: /Horaires de prière/ });
    const sunna = screen.getByRole("button", { name: /Sunna du jour/ });
    fireEvent.click(prayers);
    fireEvent.click(sunna);
    expect(prayers).toHaveAttribute("aria-expanded", "true");
    expect(sunna).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(prayers);
    expect(prayers).toHaveAttribute("aria-expanded", "false");
    expect(sunna).toHaveAttribute("aria-expanded", "true");
  });
});