import { useCallback, useEffect, useState } from "react";
import { DEFAULT_METHOD_ID, type PrayerKey } from "@/config/prieres";
import {
  clearLocation, computeNextPrayer, dayKey, fetchPrayerTimes, loadDone, loadLocation, loadMethod, minutesNow,
  purgeOldDone, saveDone, saveLocation, saveMethod, toMinutes, type DayTimings, type PrayerLocation,
} from "@/lib/prayer-times";

type Status = "idle" | "loading" | "ready" | "error";
type Tomorrow = { status: "idle" | "loading" | "ready" | "error"; fajr: string | null };

export function usePrayerTimes() {
  const [hydrated, setHydrated] = useState(false);
  const [location, setLocationState] = useState<PrayerLocation | null>(null);
  const [method, setMethodState] = useState(DEFAULT_METHOD_ID);
  const [now, setNow] = useState<Date | null>(null);
  const [today, setToday] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<DayTimings | null>(null);
  const [tomorrow, setTomorrow] = useState<Tomorrow>({ status: "idle", fajr: null });
  const [done, setDone] = useState<PrayerKey[]>([]);
  const [attempt, setAttempt] = useState(0);

  // Lecture du stockage après hydratation, jamais pendant le rendu serveur.
  useEffect(() => {
    const d = new Date();
    setLocationState(loadLocation());
    setMethodState(loadMethod());
    setNow(d);
    setToday(dayKey(d));
    setHydrated(true);
  }, []);

  // Horloge : mise à jour chaque minute, et au retour sur l'onglet. Détecte le changement de jour.
  useEffect(() => {
    if (!hydrated) return;
    const tick = () => { const d = new Date(); setNow(d); setToday(dayKey(d)); };
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => { tick(); interval = setInterval(tick, 60_000); }, 60_000 - (Date.now() % 60_000));
    const onVisible = () => { if (document.visibilityState === "visible") tick(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearTimeout(timeout); clearInterval(interval); document.removeEventListener("visibilitychange", onVisible); };
  }, [hydrated]);

  // Cases du jour : rechargées et anciennes dates supprimées à chaque nouveau jour.
  useEffect(() => {
    if (!today) return;
    purgeOldDone(today);
    setDone(loadDone(today));
  }, [today]);

  // Horaires du jour : aucune donnée d'un autre jour n'est conservée.
  useEffect(() => {
    if (!location || !today) { setStatus("idle"); setData(null); return; }
    const controller = new AbortController();
    setStatus("loading");
    setData(null);
    setTomorrow({ status: "idle", fajr: null });
    fetchPrayerTimes(location, new Date(), method, controller.signal)
      .then((result) => { if (!controller.signal.aborted) { setData(result); setStatus("ready"); } })
      .catch(() => { if (!controller.signal.aborted) setStatus("error"); });
    return () => controller.abort();
  }, [location, method, today, attempt]);

  const nowMinutes = data && now ? minutesNow(now, data.timezone) : null;
  const ishaPassed = data !== null && nowMinutes !== null && nowMinutes >= toMinutes(data.timings.Isha);

  // Après Isha : second appel pour le Fajr du lendemain.
  useEffect(() => {
    if (!ishaPassed || !location || tomorrow.status !== "idle") return;
    const controller = new AbortController();
    setTomorrow({ status: "loading", fajr: null });
    const date = new Date();
    date.setDate(date.getDate() + 1);
    fetchPrayerTimes(location, date, method, controller.signal)
      .then((result) => { if (!controller.signal.aborted) setTomorrow({ status: "ready", fajr: result.timings.Fajr }); })
      .catch(() => { if (!controller.signal.aborted) setTomorrow({ status: "error", fajr: null }); });
    return () => controller.abort();
  }, [ishaPassed, location, method, tomorrow.status]);

  const next = data && nowMinutes !== null && (!ishaPassed || tomorrow.status === "ready" || tomorrow.status === "error")
    ? computeNextPrayer(data.timings, nowMinutes, tomorrow.fajr)
    : null;

  const setLocation = useCallback((value: PrayerLocation) => { saveLocation(value); setLocationState(value); }, []);
  const resetLocation = useCallback(() => { clearLocation(); setLocationState(null); }, []);
  const setMethod = useCallback((id: number) => { saveMethod(id); setMethodState(id); }, []);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const toggleDone = useCallback((key: PrayerKey, checked: boolean) => {
    if (!today) return;
    setDone((prev) => {
      const nextDone = checked ? [...new Set([...prev, key])] : prev.filter((k) => k !== key);
      saveDone(today, nextDone);
      return nextDone;
    });
  }, [today]);

  return { hydrated, location, method, now, status, data, next, done, setLocation, resetLocation, setMethod, retry, toggleDone };
}
