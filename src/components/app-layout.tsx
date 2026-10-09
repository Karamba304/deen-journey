import { type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AppNavigation } from "@/components/app-navigation";
import { content } from "@/content/fr";

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <>
      <a href="#contenu" className="skip-link">{content.skipToContent}</a>
      <AppNavigation />
      <main id="contenu" tabIndex={-1} className="app-main">
        <div key={pathname} className="page-transition">{children}</div>
      </main>
    </>
  );
}