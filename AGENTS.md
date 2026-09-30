<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# RUIF website: project rules

- Read `docs/ARCHITECTURE.md` before structural changes; update it when a decision changes.
- Pages get content only through `lib/content/index.ts`. Never import `data.ts` from a page or component.
- Colors, fonts and spacing come from the tokens in `app/globals.css`. Don't hard-code hex values.
- Reuse components in `components/ui` before creating page-specific markup.
- Everything must work on mobile (check ~390px wide) and desktop.
- Run `npm run lint && npm run build` before finishing.
