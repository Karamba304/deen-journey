<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use TanStack Start file-based routes in src/routes rather than another router; the platform bootstrap depends on TanStack.
- Keep the app name solely in src/config/app.ts, displayed text in src/content/fr.ts and navigation definitions in src/config/navigation.ts; this prevents duplication and prepares future localization.
- Render shared navigation and one main element in AppLayout around the root Outlet; content routes use SectionPage with optional children and a shared metadata helper so Home can add content without altering the other pages.
- Reuse the existing UI Button and Card primitives and shared content-state components; do not add backend dependencies for the initial shell.
- Compose Home cards from existing Card, Button and Radix Collapsible primitives with independent local state; typed local content arrays keep unpopulated content unavailable without network calls.
- Prayer times are fetched client-side from AlAdhan only (config in src/config/prieres.ts, pure logic in src/lib/prayer-times.ts, state in src/lib/use-prayer-times.ts); browser storage is read after hydration and never shows another day's times.
