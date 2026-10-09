import { content, type PageKey } from "@/content/fr";
import { UnavailableState } from "@/components/content-states";

export function SectionPage({ page }: { page: PageKey }) {
  const { title, description } = content.pages[page];
  return (
    <section className="section-page" aria-labelledby={`title-${page}`}>
      <div className="section-accent" aria-hidden="true" />
      <h1 id={`title-${page}`} className="font-heading text-foreground">{title}</h1>
      <p className="section-description text-muted-foreground">{description}</p>
      <UnavailableState />
    </section>
  );
}