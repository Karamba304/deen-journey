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
- Render shared navigation and one main element in AppLayout around the root Outlet; each content route uses SectionPage and a shared metadata helper.
- Reuse the existing UI Button and Card primitives and shared content-state components; do not add backend dependencies for the initial shell.
