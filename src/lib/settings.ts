import { DEFAULT_METHOD_ID } from "@/config/prieres";
import { isValidMethod, loadLocation, loadMethod, parseLocation, type PrayerLocation } from "@/lib/prayer-times";

/** Tous les réglages de l'application. Ajouter un réglage = ajouter un champ ici et dans DEFAULT_SETTINGS. */
export type Settings = {
  location: PrayerLocation | null;
  method: number;
};

export const DEFAULT_SETTINGS: Settings = { location: null, method: DEFAULT_METHOD_ID };

export const SETTINGS_KEY = "mondeen.reglages";

export function loadSettings(): Settings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (raw !== null) {
      const value = JSON.parse(raw) as Partial<Record<keyof Settings, unknown>>;
      return {
        location: parseLocation(value?.location),
        method: typeof value?.method === "number" && isValidMethod(value.method) ? value.method : DEFAULT_SETTINGS.method,
      };
    }
  } catch { /* stockage indisponible ou illisible */ }
  // Reprise des anciennes clés (lieu, méthode v2) pour ne pas redemander le lieu.
  return { location: loadLocation(), method: loadMethod() };
}

export function saveSettings(settings: Settings) {
  try { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* stockage indisponible */ }
}
