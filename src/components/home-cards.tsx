import { useId, useState, type ReactNode } from "react";
import { BookOpen, ChevronDown, Clock3, GraduationCap, Sparkles, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UnavailableState } from "@/components/content-states";
import { content } from "@/content/fr";
import { sunnas } from "@/content/sunnas";
import { rappels } from "@/content/rappels";
import { lecons } from "@/content/lecons";

const copy = content.homeCards;

function HomeCard({ icon: Icon, text, children }: {
  icon: LucideIcon;
  text: { title: string; invitation: string; action: string };
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <Card className="home-card min-w-0 self-start transition-colors duration-200 data-[state=open]:border-primary">
        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" className="home-card-trigger" id={`${id}-trigger`} aria-controls={`${id}-content`}>
            <span className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <span className="flex min-w-0 items-center gap-3">
                <Icon aria-hidden="true" strokeWidth={1.5} className="home-card-icon shrink-0 text-muted-foreground" />
                <span className="home-card-title min-w-0 font-heading text-foreground">{text.title}</span>
              </span>
              <ChevronDown aria-hidden="true" className="home-card-chevron shrink-0 text-muted-foreground" />
            </span>
            <span className="mt-3 block text-sm font-normal leading-relaxed text-muted-foreground">{text.invitation}</span>
            <span className="mt-5 block text-xs font-medium text-foreground">{text.action}</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent id={`${id}-content`} role="region" aria-labelledby={`${id}-trigger`} className="home-card-panel">
          <CardContent className="px-6 pb-6 pt-0">
            <div className="border-t border-border pt-5 text-sm leading-relaxed">{children}</div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function EmptyContent() {
  return <UnavailableState message={copy.unavailable} className="m-0 text-sm leading-relaxed" />;
}

function ReligiousBlock({ children }: { children: ReactNode }) {
  return <div className="space-y-2 border-l-2 border-primary pl-4">
    <p className="text-xs text-muted-foreground">{copy.religiousText}</p>
    {children}
  </div>;
}

function TeamBlock({ children }: { children: ReactNode }) {
  return <div className="space-y-2 border-t border-border pt-4">
    <p className="text-xs text-muted-foreground">{copy.teamExplanation}</p>
    {children}
  </div>;
}

function PrayerContent() {
  return <>
    <dl className="space-y-3">
      {copy.prayerNames.map((name) => <div key={name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4"><dt>{name}</dt><dd className="text-muted-foreground">{copy.timePlaceholder}</dd></div>)}
    </dl>
    <p className="mb-0 mt-5 text-xs leading-relaxed text-muted-foreground">{copy.prayerNotice}</p>
  </>;
}

function SunnaContent() {
  if (sunnas.length === 0) return <EmptyContent />;
  return <div className="space-y-6">{sunnas.map((sunna) => <article key={sunna.id} className="space-y-4">
    <h2 className="font-heading text-2xl">{sunna.titre}</h2>
    <ReligiousBlock><p className="whitespace-pre-line">{sunna.traduction}</p><p className="text-xs text-muted-foreground">{sunna.reference}</p><p className="text-xs text-muted-foreground">{sunna.source}</p><p className="text-xs text-muted-foreground">{sunna.versionTraduction}</p></ReligiousBlock>
    <TeamBlock><p>{sunna.pratique}</p><p className="whitespace-pre-line">{sunna.explication}</p><ul className="list-disc space-y-1 pl-4">{sunna.indications.map((indication, index) => <li key={index}>{indication}</li>)}</ul></TeamBlock>
  </article>)}</div>;
}

function ReminderContent() {
  if (rappels.length === 0) return <EmptyContent />;
  return <div className="space-y-6">{rappels.map((rappel) => <article key={rappel.id}>
    {rappel.type === "formulation-equipe"
      ? <div className="space-y-3"><p className="text-xs text-muted-foreground">{copy.teamNotice}</p><p className="whitespace-pre-line">{rappel.texte}</p></div>
      : <ReligiousBlock><p className="whitespace-pre-line">{rappel.texte}</p><p className="text-xs text-muted-foreground">{rappel.reference}</p><p className="text-xs text-muted-foreground">{rappel.source}</p></ReligiousBlock>}
  </article>)}</div>;
}

function LearningContent() {
  if (lecons.length === 0) return <EmptyContent />;
  return <div className="space-y-6">{lecons.map((lecon) => <article key={lecon.id} className="space-y-4">
    <h2 className="font-heading text-2xl">{lecon.titre}</h2>
    <TeamBlock><p>{lecon.objectif}</p><p className="whitespace-pre-line">{lecon.explication}</p></TeamBlock>
    {lecon.textesReligieux.length > 0 && <ReligiousBlock>{lecon.textesReligieux.map((texte, index) => <p key={index} className="whitespace-pre-line">{texte}</p>)}{lecon.references.map((reference, index) => <p key={index} className="text-xs text-muted-foreground">{reference}</p>)}</ReligiousBlock>}
  </article>)}</div>;
}

export function HomeCards() {
  return <div className="mt-10 grid min-w-0 grid-cols-1 items-start gap-5 md:grid-cols-2">
    <HomeCard icon={Clock3} text={copy.prayers}><PrayerContent /></HomeCard>
    <HomeCard icon={Sparkles} text={copy.sunna}><SunnaContent /></HomeCard>
    <HomeCard icon={BookOpen} text={copy.reminder}><ReminderContent /></HomeCard>
    <HomeCard icon={GraduationCap} text={copy.learning}><LearningContent /></HomeCard>
  </div>;
}