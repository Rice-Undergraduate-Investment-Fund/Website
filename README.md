# Rice Undergraduate Investment Fund — Website

Source code for [financegroup.rice.edu](https://financegroup.rice.edu), the website of the Rice Undergraduate Investment Fund (RUIF).

## How this site is maintained

| I want to… | Where |
|---|---|
| Update people, sectors, photos, portfolio numbers, recruiting dates, contact info | **Sanity Studio** (no code needed, coming soon) |
| Change design, layout, pages, or functionality | **This repository** → pull request → Vercel |

> Until Sanity is connected, content lives in `lib/content/data.ts`.

## Run it locally

Requires [Node.js](https://nodejs.org) 20.9 or newer (LTS recommended).

```bash
npm install      # first time only, or after package.json changes
npm run dev      # start the dev server
```

Then open http://localhost:3000. Pages reload automatically as files change.

Other commands:

```bash
npm run build      # production build (what Vercel runs)
npm run lint       # code style checks
npm run typecheck  # TypeScript checks
```

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): technical architecture, ownership, content model, design system, decisions
- [`docs/SPEC.md`](docs/SPEC.md): product specification for the rebuild

## Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · Sanity (planned) · Vercel
