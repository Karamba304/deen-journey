import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/section-page";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/objectif")({ head: () => pageHead("goal"), component: Objectif });
function Objectif() { return <SectionPage page="goal" />; }