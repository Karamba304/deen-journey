import { useId, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useSettings } from "@/lib/settings-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorMessage, LoadingState } from "@/components/content-states";
import { AFFICHER_HORAIRES_CALCULES, CALCULATION_METHODS, CITY_MAX_LENGTH, PRAYER_KEYS } from "@/config/prieres";
import { content } from "@/content/fr";
import { formatLongDate, formatRemaining, methodName, validateCity } from "@/lib/prayer-times";
import type { usePrayerTimes } from "@/lib/use-prayer-times";

const copy = content.homeCards.prayerTimes;
type PrayerState = ReturnType<typeof usePrayerTimes>;

/** Texte compact : uniquement à partir de vraies données chargées. */
export function PrayerSummary({ state }: { state: PrayerState }) {
  const { next } = state;
  if (!AFFICHER_HORAIRES_CALCULES || !next) return null;
  if (next.tomorrow && !next.time) return <span className="mt-3 block text-sm text-foreground">{copy.nextTomorrow}</span>;
  return <span className="mt-3 block text-sm leading-relaxed">
    <span className="block text-muted-foreground">{copy.nextPrayer}</span>
    <span className="mt-1 block text-foreground">
      <span className="font-medium">{next.key}</span> · {next.time}{next.tomorrow && ` ${copy.tomorrowSuffix}`}
      {next.minutesLeft !== null && <span className="text-muted-foreground"> · {formatRemaining(next.minutesLeft)}</span>}
    </span>
  </span>;
}

export function LocationPicker() {
  const { setLocation } = useSettings();
  const id = useId();
  const [showCity, setShowCity] = useState(false);
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState<string | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const useGps = () => {
    if (!AFFICHER_HORAIRES_CALCULES) return;
    setGpsError(null);
    if (!("geolocation" in navigator)) { setGpsError(copy.gpsUnavailable); setShowCity(true); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocating(false); setLocation({ kind: "gps", latitude: pos.coords.latitude, longitude: pos.coords.longitude }); },
      (err) => { setLocating(false); setGpsError(err.code === 1 ? copy.gpsDenied : err.code === 3 ? copy.gpsTimeout : copy.gpsUnavailable); setShowCity(true); },
      { timeout: 10_000, maximumAge: 0 },
    );
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const valid = validateCity(city);
    if (!valid) { setCityError(city.trim().length === 0 ? copy.cityEmpty : copy.cityTooLong); return; }
    setCityError(null);
    setLocation({ kind: "city", city: valid });
  };

  if (!AFFICHER_HORAIRES_CALCULES) return null;
  return <div className="space-y-4">
    <p className="m-0 text-muted-foreground">{copy.locationIntro}</p>
    <div className="flex flex-wrap gap-3">
      <Button type="button" className="min-h-11" onClick={useGps} disabled={locating}>{copy.useGps}</Button>
      <Button type="button" variant="outline" className="min-h-11" onClick={() => setShowCity(true)} aria-expanded={showCity}>{copy.enterCity}</Button>
    </div>
    {locating && <p role="status" className="m-0 text-muted-foreground">{copy.gpsLocating}</p>}
    {gpsError && <p role="alert" className="m-0 text-destructive">{gpsError}</p>}
    {showCity && <form onSubmit={submit} noValidate className="space-y-2">
      <label htmlFor={`${id}-city`} className="block text-xs text-muted-foreground">{copy.cityLabel}</label>
      <div className="flex flex-wrap gap-3">
        <Input id={`${id}-city`} value={city} maxLength={CITY_MAX_LENGTH} autoComplete="address-level2"
          onChange={(e) => setCity(e.target.value)} aria-invalid={cityError ? true : undefined}
          aria-describedby={cityError ? `${id}-city-error` : undefined} className="h-11 min-w-0 flex-1 basis-48" />
        <Button type="submit" className="min-h-11">{copy.validate}</Button>
      </div>
      {cityError && <p id={`${id}-city-error`} role="alert" className="m-0 text-xs text-destructive">{cityError}</p>}
    </form>}
  </div>;
}

export function PrayerDetails({ state }: { state: PrayerState }) {
  const id = useId();
  if (!AFFICHER_HORAIRES_CALCULES) return null;
  if (!state.hydrated) return <LoadingState />;
  if (!state.location) return <LocationPicker />;

  const place = state.location.kind === "city" ? state.location.city : copy.currentPosition;
  const nextKey = state.next && !state.next.tomorrow ? state.next.key : null;

  return <div className="space-y-6">
    {state.now && <p className="m-0 font-medium text-foreground">{formatLongDate(state.now)} · {place}</p>}

    {state.status === "loading" && <LoadingState />}
    {state.status === "error" && <div className="space-y-3">
      <ErrorMessage message={copy.error} />
      <Button type="button" variant="outline" className="min-h-11" onClick={state.retry}>{content.retry}</Button>
    </div>}

    {state.status === "ready" && state.data && <div className="space-y-3">
      <ul className="m-0 list-none space-y-2 p-0">
        {PRAYER_KEYS.map((key) => {
          const isNext = key === nextKey;
          const checkboxId = `${id}-${key}`;
          return <li key={key} className={`flex min-h-11 flex-wrap items-center gap-x-4 gap-y-1 rounded-md border px-3 py-2 ${isNext ? "border-primary" : "border-border"}`}>
            <span className="min-w-0 flex-1">
              <span className={isNext ? "font-medium text-primary" : "text-foreground"}>{key}</span>
              {isNext && <span className="ml-2 text-xs text-muted-foreground">{copy.next}</span>}
            </span>
            <span className="tabular-nums text-foreground">{state.data!.timings[key]}</span>
            <label htmlFor={checkboxId} className="flex min-h-11 cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input id={checkboxId} type="checkbox" className="size-5 accent-primary"
                checked={state.done.includes(key)} onChange={(e) => state.toggleDone(key, e.target.checked)}
                aria-label={`${key} ${copy.doneLabel}`} />
              {copy.doneLabel}
            </label>
          </li>;
        })}
      </ul>
      <p className="m-0 text-xs text-muted-foreground">{copy.checksNotice}</p>
    </div>}

    <p className="m-0 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
      <span>{copy.calculation} <span className="text-foreground">{methodName(state.method)}</span></span>
      <Link to="/parametres" className="inline-flex min-h-11 items-center text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-primary">{copy.editInSettings}</Link>
    </p>

    <p className="m-0 text-xs text-muted-foreground">{copy.methodNotice}</p>

    <Button type="button" variant="outline" className="min-h-11" onClick={state.resetLocation}>{copy.changeLocation}</Button>
  </div>;
}

/** Sélecteur de méthode relié aux réglages partagés. */
export function MethodSelect() {
  const { method, setMethod } = useSettings();
  const id = useId();
  if (!AFFICHER_HORAIRES_CALCULES) return null;
  return <div className="space-y-2">
    <label htmlFor={id} className="block text-sm text-foreground">{copy.methodLabel}</label>
    <select id={id} value={method} onChange={(e) => setMethod(Number(e.target.value))}
      className="h-11 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-primary">
      {CALCULATION_METHODS.map((m) => <option key={m.id} value={m.id}>{methodName(m.id)}</option>)}
    </select>
    <p className="m-0 text-xs text-muted-foreground">{copy.methodNotice}</p>
  </div>;
}
