import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type Settings } from "@/lib/settings";
import type { PrayerLocation } from "@/lib/prayer-times";

type SettingsValue = Settings & {
  hydrated: boolean;
  setLocation: (location: PrayerLocation) => void;
  resetLocation: () => void;
  setMethod: (id: number) => void;
};

const SettingsContext = createContext<SettingsValue | null>(null);

/** Source unique des réglages, partagée par l'Accueil et les Paramètres. */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Lecture après hydratation, jamais pendant le rendu serveur.
  useEffect(() => { setSettings(loadSettings()); setHydrated(true); }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => { const next = { ...prev, ...patch }; saveSettings(next); return next; });
  }, []);

  const value = useMemo<SettingsValue>(() => ({
    ...settings,
    hydrated,
    setLocation: (location) => update({ location }),
    resetLocation: () => update({ location: null }),
    setMethod: (method) => update({ method }),
  }), [settings, hydrated, update]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const value = useContext(SettingsContext);
  if (!value) throw new Error("useSettings doit être utilisé dans SettingsProvider");
  return value;
}
