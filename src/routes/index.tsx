import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/section-page";
import { pageHead } from "@/lib/page-head";
import { HomeCards } from "@/components/home-cards";

export const Route = createFileRoute("/")({ head: () => pageHead("home"), component: Index });
function Index() { return <SectionPage page="home"><HomeCards /></SectionPage>; }
