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
6. **Updating the portfolio from code** (e.g. after a new letter is added to `lib/content/data.ts`): `npm run seed:portfolio` replaces the Portfolio, Holdings and Letters documents in Sanity. Day-to-day, just edit them in the Studio.

Until the dataset is seeded (or if Sanity can't be reached), the site automatically shows the starter content from `lib/content/data.ts`.

## Troubleshooting

**`npm` commands hang on a Mac with iCloud Desktop & Documents sync.** iCloud syncs and offloads the tens of thousands of files in `node_modules`, `.next` and `.git`, and Node.js stalls waiting for them. (Symlinking `node_modules` to a `.nosync` folder does *not* hold: `npm install` replaces the link.) Reliable fixes:

- Keep the repo outside iCloud (e.g. `~/Developer/RUIF-Website`), or give the repo folder a name ending in `.nosync` (iCloud ignores it). Re-clone from GitHub into the new location and copy `.env.local` over.
- Turning off *Optimize Mac Storage* (System Settings → Apple ID → iCloud) stops files being offloaded, which removes most hangs, but iCloud still syncs the folder.
- For one-off scripts, use the `/tmp` workaround below.

**Running Sanity scripts on a Mac with iCloud Desktop (verified workaround)**

If the repo lives in an iCloud-synced folder (e.g. Desktop), `npm` commands there can hang because iCloud syncs/offloads `node_modules`. Run seed scripts from a temporary copy outside iCloud instead. This works and was used to publish the Fall 2026 portfolio content:

```bash
rm -rf /tmp/ruif-seed && mkdir /tmp/ruif-seed
cd ~/Desktop/Rice/RUIF/Website/Website
cp -R package.json package-lock.json tsconfig.json .env.local scripts lib sanity public /tmp/ruif-seed/
cd /tmp/ruif-seed
npm ci
npm run seed:portfolio
```

- Swap the last line for `npm run seed` (empty dataset) or `npm run seed:clean` (remove placeholder people) as needed.
- It copies only what the scripts need, including `.env.local` (the Sanity write token). `/tmp` is cleared on restart.
- Re-run the `cp` line after changing `lib/content/data.ts` so the copy is current.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): technical architecture, ownership, content model, design system, decisions
- [`docs/SPEC.md`](docs/SPEC.md): product specification for the rebuild
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md): Netlify + Sanity deployment checklist

## Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · Sanity · Netlify
