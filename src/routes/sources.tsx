import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/section-page";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/sources")({ head: () => pageHead("sources"), component: Sources });
function Sources() { return <SectionPage page="sources" />; }