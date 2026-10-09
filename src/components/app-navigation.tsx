import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { APP_NAME } from "@/config/app";
import { sections } from "@/config/navigation";
import { content } from "@/content/fr";
import { Button } from "@/components/ui/button";

export function AppNavigation() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active) return;
    const navBox = nav.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    if (activeBox.left < navBox.left || activeBox.right > navBox.right) {
      nav.scrollTo({ left: active.offsetLeft - nav.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }, [pathname]);

  return (
    <header className="app-header">
      <div className="header-inner">
        <span className="app-name font-heading">{APP_NAME}<span className="brand-mark" aria-hidden="true" /></span>
        <nav ref={navRef} className="app-nav" aria-label={content.navigation}>
          {sections.map(({ label, path, icon: Icon }) => (
            <Button key={path} asChild variant="ghost" className="nav-item">
              <Link to={path} activeOptions={{ exact: true }} aria-current={pathname === path ? "page" : undefined}
                onKeyDown={(event) => { if (event.key === " ") { event.preventDefault(); event.currentTarget.click(); } }}>
                <Icon aria-hidden="true" strokeWidth={1.6} />
                <span>{label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}