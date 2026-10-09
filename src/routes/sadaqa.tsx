import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/section-page";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/sadaqa")({ head: () => pageHead("sadaqa"), component: Sadaqa });
function Sadaqa() { return <SectionPage page="sadaqa" />; }