import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/section-page";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/compte")({ head: () => pageHead("account"), component: Compte });
function Compte() { return <SectionPage page="account" />; }