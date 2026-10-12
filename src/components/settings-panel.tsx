import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/content-states";
import { LocationPicker, MethodSelect } from "@/components/prayer-times";
import { content } from "@/content/fr";
import { useSettings } from "@/lib/settings-context";
import { AFFICHER_HORAIRES_CALCULES } from "@/config/prieres";

const copy = content.settings;

function LocationSetting() {
  const { location } = useSettings();
  const [editing, setEditing] = useState(false);
  const place = location ? (location.kind === "city" ? location.city : content.homeCards.prayerTimes.currentPosition) : null;
  return <div className="space-y-3">
    <h3 className="m-0 text-sm font-medium text-foreground">{copy.locationLabel}</h3>
    <p className="m-0 text-sm text-muted-foreground">{place ? <>{copy.currentLocation} <span className="text-foreground">{place}</span></> : copy.noLocation}</p>
    {place && !editing
      ? <Button type="button" variant="outline" className="min-h-11" onClick={() => setEditing(true)}>{content.homeCards.prayerTimes.changeLocation}</Button>
      : <LocationPicker key={place ?? "none"} />}
  </div>;
}

export function SettingsPanel() {
  const { hydrated, location } = useSettings();
  if (!AFFICHER_HORAIRES_CALCULES) return <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">{copy.unavailable}</p>;
  return <div className="mt-10 max-w-2xl space-y-4">
    <Card className="min-w-0">
      <CardContent className="space-y-8 p-6">
        <h2 className="m-0 font-heading text-2xl text-foreground">{copy.groupTitle}</h2>
        {hydrated ? <><LocationSetting key={location ? JSON.stringify(location) : "none"} /><MethodSelect /></> : <LoadingState />}
      </CardContent>
    </Card>
    <p className="m-0 text-sm text-muted-foreground">{copy.moreLater}</p>
  </div>;
}
