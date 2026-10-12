import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/section-page";
import { SettingsPanel } from "@/components/settings-panel";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/parametres")({ head: () => pageHead("settings"), component: Parametres });
function Parametres() { return <SectionPage page="settings"><SettingsPanel /></SectionPage>; }
