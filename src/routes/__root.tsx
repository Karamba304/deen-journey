import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { APP_NAME } from "@/config/app";
import { content } from "@/content/fr";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <div className="fallback-page">
      <div className="section-accent" aria-hidden="true" />
      <h1 className="font-heading">{content.notFoundTitle}</h1>
      <p className="my-6 leading-relaxed text-muted-foreground">{content.notFoundDescription}</p>
      <Button asChild variant="outline"><Link to="/">{content.home}</Link></Button>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <AppLayout>
      <div className="fallback-page">
        <h1 className="font-heading">{content.errorTitle}</h1>
        <p className="my-6 text-muted-foreground">{content.errorDescription}</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => { router.invalidate(); reset(); }}>{content.retry}</Button>
          <Button asChild variant="outline"><Link to="/">{content.home}</Link></Button>
        </div>
      </div>
    </AppLayout>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "description", content: content.pages.home.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout><Outlet /></AppLayout>
    </QueryClientProvider>
  );
}
