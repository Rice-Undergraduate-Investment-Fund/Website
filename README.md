# Rice Undergraduate Investment Fund — Website

Source code for [financegroup.rice.edu](https://financegroup.rice.edu), the website of the Rice Undergraduate Investment Fund (RUIF).

## How this site is maintained

| I want to… | Where |
|---|---|
| Update people, sectors, photos, portfolio numbers, recruiting dates, contact info | **Sanity Studio** at `/studio` (no code needed) |
| Change design, layout, pages, or functionality | **This repository** → pull request → Netlify |

Published Studio changes appear on the live site within about a minute.

## Run it locally

Requires [Node.js](https://nodejs.org) 20.9 or newer (LTS recommended).

```bash
npm install      # first time only, or after package.json changes
npm run dev      # start the dev server
```

Then open http://localhost:3000. Pages reload automatically as files change.

Other commands:

```bash
npm run build      # production build (what Netlify runs)
npm run lint       # code style checks
npm run typecheck  # TypeScript checks
```

## Sanity (CMS) setup

Project ID `237x8krw`, dataset `production` (set in `sanity/env.ts`).

**One-time setup**

1. **Allow the local site to talk to Sanity:** [sanity.io/manage](https://www.sanity.io/manage) → RUIF project → **API** → **CORS origins** → *Add CORS origin* → `http://localhost:3000`, tick **Allow credentials**. (Add the production URL the same way at launch.)
2. **Check the dataset is public:** same page → **Datasets** → `production` should say *Public*. (The website reads published content without a key. If it's private, the site quietly falls back to starter content.)
3. **Open the editor:** run `npm run dev` and visit http://localhost:3000/studio. Log in with the Sanity account that owns the project.
4. **Fill an empty dataset with the starter content** (only needed once):
   - sanity.io/manage → project → **API** → **Tokens** → *Add API token*, name "seed script", permission **Editor**. Copy the token.
   - Copy `.env.example` to `.env.local` and paste the token after `SANITY_API_WRITE_TOKEN=`. `.env.local` is git-ignored, so never commit it or share it.
   - Run `npm run seed`. It uploads the photos and creates all documents. It refuses to run if the dataset already has content.
5. Optional: `npm run seed:clean` removes all placeholder people ("Member 1", "Director Name", "Name TBD", sample alumni) once real people are added.

Until the dataset is seeded (or if Sanity can't be reached), the site automatically shows the starter content from `lib/content/data.ts`.

## Troubleshooting

**`npm run dev` hangs on a Mac with iCloud Desktop & Documents sync.** iCloud tries to sync the tens of thousands of files in `node_modules` and `.next`, and Next.js stalls waiting for them. Folders ending in `.nosync` are skipped by iCloud, so keep the real folders there and link to them:

```bash
rm -rf .next node_modules
mkdir node_modules.nosync .next.nosync
ln -s node_modules.nosync node_modules
ln -s .next.nosync .next
npm install
```

(All of these are git-ignored.)

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): technical architecture, ownership, content model, design system, decisions
- [`docs/SPEC.md`](docs/SPEC.md): product specification for the rebuild
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md): Netlify + Sanity deployment checklist

## Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · Sanity · Netlify
