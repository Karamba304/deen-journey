import { AJUSTEMENT_MAGHRIB_MINUTES, ANGLE_FAJR, ANGLE_ISHA, APP_SETTING_ID, CALCULATION_METHODS, CITY_MAX_LENGTH, CUSTOM_API_METHOD, DEFAULT_METHOD_ID, PRAYER_API_BASE, PRAYER_API_TIMEOUT_MS, PRAYER_KEYS, type PrayerKey } from "@/config/prieres";
import { content } from "@/content/fr";

export type PrayerLocation = { kind: "city"; city: string } | { kind: "gps"; latitude: number; longitude: number };
export type Timings = Record<PrayerKey, string>;
export type DayTimings = { timings: Timings; timezone: string | null };

const STORAGE_PREFIX = "mondeen.prieres.";
const LOCATION_KEY = `${STORAGE_PREFIX}lieu`;
const METHOD_KEY = `${STORAGE_PREFIX}methode`;
const DONE_PREFIX = `${STORAGE_PREFIX}accomplies.`;

function pad(n: number) { return String(n).padStart(2, "0"); }

/** Date au format JJ-MM-AAAA attendu par AlAdhan. */
export function apiDate(date: Date) { return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`; }
/** Clé de jour locale de l'appareil, AAAA-MM-JJ. */
export function dayKey(date: Date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }

export function validateCity(value: string): string | null {
  const city = value.trim();
  return city.length > 0 && city.length <= CITY_MAX_LENGTH ? city : null;
}

export function isValidMethod(id: number) { return CALCULATION_METHODS.some((m) => m.id === id); }
export function methodName(id: number) {
  if (id === APP_SETTING_ID) return content.homeCards.prayerTimes.appSetting(ANGLE_FAJR, ANGLE_ISHA, AJUSTEMENT_MAGHRIB_MINUTES);
  return CALCULATION_METHODS.find((m) => m.id === id)?.name ?? "";
}

/** Paramètres « method » (et réglages personnalisés) envoyés à AlAdhan. */
export function methodParams(method: number): Record<string, string> {
  if (method !== APP_SETTING_ID) return { method: String(method) };
  // Ordre officiel tune : Imsak, Fajr, Sunrise, Dhuhr, Asr, Maghrib, Sunset, Isha, Midnight.
  const tune = [0, 0, 0, 0, 0, AJUSTEMENT_MAGHRIB_MINUTES, 0, 0, 0];
  return { method: String(CUSTOM_API_METHOD), methodSettings: `${ANGLE_FAJR},null,${ANGLE_ISHA}`, tune: tune.join(",") };
}

export function buildPrayerUrl(location: PrayerLocation, date: Date, method: number) {
  const params = location.kind === "city"
    ? { address: location.city, ...methodParams(method) }
    : { latitude: String(location.latitude), longitude: String(location.longitude), ...methodParams(method) };
  const query = new URLSearchParams(params).toString().replace(/%2C/g, ",");
  return `${PRAYER_API_BASE}/${location.kind === "city" ? "timingsByAddress" : "timings"}/${apiDate(date)}?${query}`;
}

/** Garde uniquement les 5 premiers caractères (HH:mm) et refuse toute valeur invalide. */
export function cleanTime(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const time = value.slice(0, 5);
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time) ? time : null;
}

export function parsePrayerResponse(json: unknown): DayTimings {
  const data = (json as { code?: number; data?: { timings?: Record<string, unknown>; meta?: { timezone?: unknown } } })?.data;
  if ((json as { code?: number })?.code !== 200 || !data?.timings) throw new Error("Réponse invalide");
  const timings = {} as Timings;
  for (const key of PRAYER_KEYS) {
    const time = cleanTime(data.timings[key]);
    if (!time) throw new Error("Heure invalide");
    timings[key] = time;
  }
  const tz = typeof data.meta?.timezone === "string" ? data.meta.timezone : null;
  return { timings, timezone: tz && isValidTimezone(tz) ? tz : null };
}

function isValidTimezone(tz: string) {
  try { new Intl.DateTimeFormat("en", { timeZone: tz }); return true; } catch { return false; }
}

export async function fetchPrayerTimes(location: PrayerLocation, date: Date, method: number, signal?: AbortSignal): Promise<DayTimings> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PRAYER_API_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);
  try {
    const response = await fetch(buildPrayerUrl(location, date, method), { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return parsePrayerResponse(await response.json());
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

/** Les heures sont validées par cleanTime avant usage ; un format invalide lève une erreur (aucune heure inventée). */
export function toMinutes(time: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!match) throw new Error("Heure invalide");
  return Number(match[1]) * 60 + Number(match[2]);
}

/** Minutes écoulées depuis minuit dans le fuseau donné (ou celui de l'appareil). */
export function minutesNow(now: Date, timezone: string | null) {
  if (!timezone) return now.getHours() * 60 + now.getMinutes();
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get("hour") * 60 + get("minute");
}

export type NextPrayer = { key: PrayerKey; time: string; minutesLeft: number; tomorrow: false } | { key: "Fajr"; time: string | null; minutesLeft: number | null; tomorrow: true };

export function computeNextPrayer(timings: Timings, nowMinutes: number, tomorrowFajr: string | null): NextPrayer {
  for (const key of PRAYER_KEYS) {
    const t = toMinutes(timings[key]);
    if (t > nowMinutes) return { key, time: timings[key], minutesLeft: t - nowMinutes, tomorrow: false };
  }
  if (!tomorrowFajr) return { key: "Fajr", time: null, minutesLeft: null, tomorrow: true };
  return { key: "Fajr", time: tomorrowFajr, minutesLeft: 24 * 60 - nowMinutes + toMinutes(tomorrowFajr), tomorrow: true };
}

export function formatRemaining(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `dans ${m} min`;
  return m === 0 ? `dans ${h} h` : `dans ${h} h ${pad(m)}`;
}

export function formatLongDate(date: Date) {
  const text = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Stockage local : chaque accès est protégé, l'app fonctionne si le stockage est vide ou bloqué.
function read(key: string): string | null { try { return window.localStorage.getItem(key); } catch { return null; } }
function write(key: string, value: string) { try { window.localStorage.setItem(key, value); } catch { /* stockage indisponible */ } }
function remove(key: string) { try { window.localStorage.removeItem(key); } catch { /* stockage indisponible */ } }

export function loadLocation(): PrayerLocation | null {
  try {
    const value = JSON.parse(read(LOCATION_KEY) ?? "null");
    if (value?.kind === "city" && typeof value.city === "string" && validateCity(value.city)) return { kind: "city", city: validateCity(value.city)! };
    if (value?.kind === "gps" && Number.isFinite(value.latitude) && Number.isFinite(value.longitude)) return { kind: "gps", latitude: value.latitude, longitude: value.longitude };
  } catch { /* valeur illisible */ }
  return null;
}
export function saveLocation(location: PrayerLocation) { write(LOCATION_KEY, JSON.stringify(location)); }
export function clearLocation() { remove(LOCATION_KEY); }

export function loadMethod(): number {
  const id = Number(read(METHOD_KEY));
  return read(METHOD_KEY) !== null && isValidMethod(id) ? id : DEFAULT_METHOD_ID;
}
export function saveMethod(id: number) { write(METHOD_KEY, String(id)); }

export function loadDone(day: string): PrayerKey[] {
  try {
    const value = JSON.parse(read(DONE_PREFIX + day) ?? "[]");
    return Array.isArray(value) ? PRAYER_KEYS.filter((k) => value.includes(k)) : [];
  } catch { return []; }
}
export function saveDone(day: string, done: PrayerKey[]) { write(DONE_PREFIX + day, JSON.stringify(done)); }

/** Supprime les cases des jours passés. */
export function purgeOldDone(day: string) {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(DONE_PREFIX) && key !== DONE_PREFIX + day) keys.push(key);
    }
    keys.forEach(remove);
  } catch { /* stockage indisponible */ }
}
