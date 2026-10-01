# RUIF Website — Architecture

> Living reference for how the Rice Undergraduate Investment Fund website is built, owned, and maintained.
> Source of product requirements: [`docs/SPEC.md`](SPEC.md). This file records the **technical decisions** that implement it.
> Update this file whenever an architectural decision changes.

**Repository:** https://github.com/Rice-Undergraduate-Investment-Fund/Website
**Production domain:** `financegroup.rice.edu`
**Last updated:** 2026-09-30 (Sanity connected)

---

## 1. Golden rule

> **Content change → Sanity**
> **Design / functionality change → GitHub → Netlify**

A new officer with no coding experience must be able to update the Board, sectors, photos, portfolio figures, recruiting dates and contact details **without touching GitHub**.

---

## 2. Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | Server components; static generation + on-demand revalidation |
| Language | TypeScript (strict) | |
| Styling | Tailwind CSS v4 | Design tokens defined once in `app/globals.css` (`@theme`), see §6 |
| CMS | Sanity (project `237x8krw`, dataset `production`) | Studio embedded at `/studio` in the same repo |
| Hosting | Netlify (Next.js runtime / OpenNext adapter) | Deploy Preview per PR, production on merge to `main`; config in `netlify.toml` |
| Source control | GitHub org `Rice-Undergraduate-Investment-Fund` | Club-owned, not personal |
| Images | `next/image` (Sanity image CDN once connected) | Crop/hotspot set in Studio |
| Fonts | Source Serif 4 + Inter via Fontsource | Self-hosted, no external font requests |
| Contact form | Serverless route (`/api/contact`) + email service | Provider TBD (§10) |
| Analytics | Netlify Analytics or Google Analytics | Optional |
| Database | **None** | Add (e.g. Supabase) only for auth, voting, attendance, etc. |

### Data flow

```text
Officer edits in Sanity Studio ──publish──▶ Sanity Content Lake
                                                │ webhook
                                                ▼
Developer ──PR──▶ GitHub ──▶ Netlify build ◀── on-demand revalidation
                                │
                                ▼
                     financegroup.rice.edu
```

Published content appears on the live site within ~60 seconds (time-based revalidation: `REVALIDATE` in `lib/content/index.ts`). No redeploy needed for content changes. With the Sanity webhook → `/api/revalidate` configured, edits appear immediately (see `docs/DEPLOYMENT.md`).

---

## 3. Ownership & access

All services are owned by the **club**, not an individual. Each should have **at least two admins** at all times.

| Service | Owner account | Admins (current) | Notes |
|---|---|---|---|
| GitHub org | Club org | _TBD_ | Branch protection on `main` |
| Sanity project | Club org / shared club login | _TBD_ | Officers get Editor role, not Admin |
| Netlify team | Club team / shared club login | _TBD_ | Not a personal team |
| DNS (`financegroup.rice.edu`) | Rice IT | Rice IT contact _TBD_ | CNAME to Netlify |
| Contact email service | Shared club login | _TBD_ | |

**Recommendation:** register Sanity, Netlify and any email service with a shared club email (not a personal `netID@rice.edu`), with credentials passed on at each leadership transition.

---

## 4. Repository structure

```text
/
├── app/
│   ├── layout.tsx            Root HTML shell, fonts, global metadata
│   ├── globals.css           Design tokens (@theme) + base styles
│   ├── icon.png              Favicon (RUIF logo)
│   ├── not-found.tsx         404 page
│   └── (site)/               Public website (shared header + footer)
│       ├── layout.tsx
│       ├── page.tsx          Home
│       ├── about/
│       ├── sectors/          Grid + modal
│       ├── portfolio/
│       ├── training/
│       ├── people/board/
│       ├── people/alumni/
│       └── contact/
│   ├── studio/[[...tool]]/   Embedded Sanity Studio (/studio)
│   ├── api/revalidate/       Sanity webhook → instant content refresh
│   (planned: app/api/contact)
├── components/
│   ├── ui/                   Primitives: Container, Section, SectionHeading, Button, PhotoHero, StatRow, ProcessSteps…
│   ├── layout/               Header (responsive nav, Apply button), Footer
│   ├── people/               PersonPhoto (square photo or placeholder), PersonCard
│   ├── sectors/              SectorDirectory (grid), SectorModal
│   ├── portfolio/            AllocationChart, PerformanceTable, LetterViewer (pdf.js)
│   └── contact/              ContactForm
├── lib/
│   ├── content/
│   │   ├── types.ts          Content types (mirror the Sanity schemas in §5)
│   │   ├── data.ts           Seed + fallback content
│   │   └── index.ts          getSectors(), getBoard()… (GROQ queries; the only thing pages call)
│   └── navigation.ts         Primary navigation (code-owned)
├── sanity/
│   ├── env.ts                Project ID / dataset / API version
│   ├── lib/client.ts         Read client + image URL builder
│   ├── schemaTypes/          person, sector, holding, timelineEvent, siteSettings, portfolio, trainingProgram
│   └── structure.ts          Studio sidebar (Board, Sectors, Current Members, Alumni…)
├── sanity.config.ts          Studio config (singleton guardrails)
├── scripts/
│   ├── seed.ts               npm run seed: fill an empty dataset from lib/content/data.ts
│   └── clean-placeholders.ts npm run seed:clean: remove "placeholder-*" people
├── public/images/            Optimized photos + logo (seed source)
├── docs/                     ARCHITECTURE.md, SPEC.md, DEPLOYMENT.md
└── AGENTS.md / CLAUDE.md     Instructions for AI coding assistants
```

### Content access layer
Pages never import data directly. They call async functions in `lib/content/index.ts` (e.g. `getSectors()` returns sectors with director and members resolved) which run GROQ queries against Sanity.

**Fallback:** if the dataset has no `siteSettings` document (not yet seeded) or Sanity is unreachable, every getter returns the seed content from `data.ts`, so the site always renders.

**Images:** Sanity photos are served from `cdn.sanity.io` (allowed in `next.config.ts`) through `next/image`. The editor-set hotspot becomes the CSS `object-position`, so faces stay in frame at any crop.

**Page photos** (hero banners and feature images) live in Site Settings → Page photos, not in code.

---

## 5. Content model (Sanity)

### Principles
- **Each person is stored once** and referenced everywhere (Board, Sectors, Alumni).
- Page placement is **derived from data**, never duplicated.
- Editors control content only — never colors, typography, layout or navigation.

### `person`
| Field | Type | Notes |
|---|---|---|
| name | string | required |
| photo | image (hotspot) | square crop used site-wide |
| email | string | optional |
| linkedin | url | optional |
| graduationYear | number | |
| bio | text | optional |
| status | `current` \| `alumni` | radio buttons |
| boardPosition | string | empty = not on Board |
| boardOrder | number | display order on /board |
| employer, jobTitle, location | string | alumni fields |
| formerPosition | string | alumni: role held in RUIF |

> Sector membership and director are stored on the **sector** (below), so a person cannot accidentally be listed in two places inconsistently.

### `sector`
| Field | Type |
|---|---|
| name, slug | string / slug |
| description | text |
| director | reference → person |
| members | array of references → person |
| order | number |
| holdings | array of references → holding (optional) |

### Other types
| Type | Kind | Contents |
|---|---|---|
| `portfolio` | singleton | AUM, return since inception (%), inception year, as-of label, note, benchmark (VTI), beta, performance rows `[{period, fund %, benchmark %}]` (alpha computed), allocations (warns if ≠ 100%) |
| `holding` | document | company, ticker, sector, featured? (card in “Selected positions”), highlight, order. All holdings are listed by sector |
| `letter` | document | title, semester, published date, PDF file. Newest is embedded on /portfolio (pdf.js viewer: page arrows, expand, download) |
| `trainingProgram` | singleton | semester label, applications open? (drives Apply buttons), open date, deadline, apply URL, steps, sessions (numbered by order) |
| `timelineEvent` | document | year, title, description, order (About → history) |
| `siteSettings` | singleton | org name, tagline, intro, stats, mission, operating/investment steps, alumni employers, contacts, socials, page photos |

### Derived queries
| Page | Query |
|---|---|
| /people/board | `person` where `boardPosition` set, `status == current`, ordered by `boardOrder` |
| /sectors | all `sector` ordered, with director + members expanded |
| /people/alumni | `person` where `status == alumni`, grouped by `graduationYear` desc |

---

## 6. Design system

### Colors — official Rice brand values (brand.rice.edu)
| Token | Name | HEX | Use |
|---|---|---|---|
| `rice-blue` | Rice University Blue (PMS 280) | `#00205B` | Primary brand color |
| `rice-gray` | Rice University Gray (PMS 425) | `#7C7E7F` | Secondary text, dividers |
| `white` | White | `#FFFFFF` | Primary background |
| `black` | Black | `#000000` | Text / accent where needed |
| `light-gray` | Light Gray | `#E0E2E6` | Section backgrounds, borders |
| `rich-blue` | Rich Blue | `#0A509E` | Hover / link states (optional) |

Additional Rice secondary colors exist; add them only with a clear reason (the spec asks to avoid excessive color).

Implementation: `app/globals.css` → `@theme` tokens `rice-blue`, `rice-blue-deep` (Midnight Blue, overlays/footer), `rich-blue`, `rice-gray`, `ink`, `slate` (Rice Dark Gray `#44474F`, secondary text, since Rice Gray is too light for small text), `line`, `mist` (`#F4F5F7` section tint).

### Typography
| Role | Font | Notes |
|---|---|---|
| Headings | Source Serif 4 (variable) | Institutional, finance feel |
| Body / UI | Inter (variable) | |
| Eyebrow labels | Inter, 12px, semibold, uppercase, 0.2em tracking | With a short rule before |

Rice's official typefaces are licensed; these are free, close-in-spirit substitutes. Swap in `globals.css` if licensed fonts become available.

### Layout conventions
- Container: max width 80rem, 20px/32px side padding.
- Section rhythm: 80px (mobile) / 112px (desktop) vertical padding; tones `white`, `mist`, `blue`.
- Square corners, 1px `line` borders, no drop shadows except the modal.
- Grids of cards use border-collapse style (`border-t border-l` container, `border-r border-b` cells) so any item count renders cleanly.

### Sector modal (spec §6.2)
Native `<dialog>` (focus trap, Esc, backdrop). Director photo and member grid share one column, so the director is exactly as wide as three members plus gaps. Members: 3 columns (2 below 360px). Open sector is mirrored in the URL (`/sectors#energy`) for direct links; Previous/Next moves between sectors.

---

## 7. Routing & navigation

```text
/                   Home
/about              About
/sectors            Sector grid + modal (no separate sector pages in v1)
/portfolio          Portfolio
/training           Training Program
/people/board       Board
/people/alumni      Alumni
/contact            Contact
/studio             Sanity Studio (editors only)
```

The navigation structure lives in code. The **Apply** button is shown when `siteSettings.showApplyButton` / `trainingProgram.applicationsOpen` is true.

---

## 8. Development workflow

```text
branch → commit → pull request → Netlify Deploy Preview URL → review → merge to main → production deploy
```

- `main` is protected: changes arrive via PR only.
- Every PR gets a preview URL. Check mobile and desktop before merging.
- Secrets live only in Netlify environment variables and a local `.env.local` (git-ignored).

### Environment variables
| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Optional override (default `237x8krw` in `sanity/env.ts`) |
| `NEXT_PUBLIC_SANITY_DATASET` | Optional override (default `production`) |
| `SANITY_API_WRITE_TOKEN` | Local only, for `npm run seed` / `seed:clean`. Never on Netlify, never committed |
| `SANITY_REVALIDATE_SECRET` | Netlify only: verifies Sanity webhook calls to `/api/revalidate` |
| `CONTACT_*` | Planned: contact form provider keys |

The website itself needs **no secrets**: the dataset is read publicly (published documents only). See `.env.example`.

### Sanity CORS origins (sanity.io/manage → API)
`http://localhost:3000` (with credentials) for local Studio; add the Netlify production + Deploy Preview URLs at deployment.


### Adding headshots

Headshots are never stored in the repo (it's public). Either:

1. **Studio (preferred for officers):** open the person → drag in the photo → set the focal point on the face → Publish. Or
2. **In bulk:** save each photo as `seed-assets/people/<person-id>.jpg` (square, face-centred; the id is the name in lowercase with dashes, e.g. `jane-smith.jpg`). The folder is git-ignored. Then run `npm run seed:people`. People without a local file keep the photo they already have in Sanity.

**Alumni firms** ("Where RUIF members go" on the home page): Studio → Alumni Firms. Each firm has an industry (= tab: Investment Banking, Private Equity, Hedge Funds & Trading; defined in `ALUMNI_INDUSTRIES` in `lib/content/types.ts`) and a row (1 = top, e.g. bulge brackets). Rows are unlabeled and sorted A–Z. A firm in two industries gets two entries.

**Page photos** (About page etc.) follow the same pattern: save as `seed-assets/site/<photoKey>.jpg` (e.g. `aboutHero`, `aboutMission`, `aboutFund`, `aboutHistory`) and run `npm run seed:about`. Editors can also replace them in the Studio under Site Settings → Photos. Timeline milestones support an optional link (`linkText` + `linkUrl`): the matching words in the description become a link.

### Running Sanity scripts on a Mac with iCloud Desktop (verified workaround)

If the repo lives in an iCloud-synced folder (e.g. Desktop), `npm` commands there can hang because iCloud syncs/offloads `node_modules`. Run seed scripts from a temporary copy outside iCloud instead. This works and was used to publish the Fall 2026 portfolio content:

```bash
rm -rf /tmp/ruif-seed && mkdir /tmp/ruif-seed
cd ~/Desktop/Rice/RUIF/Website/Website
cp -R package.json package-lock.json tsconfig.json .env.local scripts lib sanity public seed-assets /tmp/ruif-seed/
cd /tmp/ruif-seed
npm ci
npm run seed:portfolio
```

- Swap the last line for `npm run seed:people` (board + sector rosters), `npm run seed` (empty dataset) or `npm run seed:clean` (remove placeholder people) as needed.
- It copies only what the scripts need, including `.env.local` (the Sanity write token). `/tmp` is cleared on restart.
- Re-run the `cp` line after changing `lib/content/data.ts` so the copy is current.

---

## 9. Hosting notes

Full step-by-step: **`docs/DEPLOYMENT.md`**. One deployment (GitHub → Netlify) ships both the website and the embedded Studio; content stays in Sanity's cloud.


- **Host:** Netlify, chosen over Vercel (2026-09-30): officers already know it and it supports Next.js 16 fully. Like Vercel's free plan, Netlify's free plan doesn't deploy private org-owned repos, so the repo is public. That's safe because the site needs no secrets; the only secret (the Sanity write token) lives in each developer's git-ignored `.env.local`.
- **Domain:** `financegroup.rice.edu` already points to an external host (Wix), so external hosting is established. At launch the DNS record must be switched from Wix to Netlify by whoever manages it (Rice IT or the officer who set up Wix) — identify them before launch.

---

## 10. Decision log

| Date | Decision | Status |
|---|---|---|
| 2026-09-30 | Stack: Next.js + TS + Tailwind + Sanity (spec) | Decided |
| 2026-09-30 | Hosting: **Netlify** instead of the spec's Vercel | Decided |
| 2026-09-30 | GitHub org `Rice-Undergraduate-Investment-Fund` created, repo `Website` | Done |
| 2026-09-30 | Colors: official Rice Blue `#00205B` / white / black | Decided |
| 2026-09-30 | Sanity Studio embedded at `/studio` in the same repo | Done |
| 2026-09-30 | Sanity project `237x8krw` / `production` created | Done |
| 2026-09-30 | Singletons can't be created/deleted in Studio | Done |
| 2026-09-30 | Page photos editable in Site Settings | Done |
| 2026-09-30 | Semester letter PDF embedded on Portfolio page; figures from Fall 2026 letter | Done |
| 2026-09-30 | pdf.js pinned to v4 (v5+/v6 need very new browser APIs) | Done |
| 2026-09-30 | Tailwind v4: tokens in `globals.css`, no `tailwind.config.ts` | Done |
| 2026-09-30 | Fonts: Source Serif 4 + Inter, self-hosted | Done (revisable) |
| 2026-09-30 | Content layer reads Sanity, falls back to seed data | Done |
| 2026-09-30 | Sector membership stored on `sector`, not `person` | Done |
| — | Contact form provider (Resend / Formspree / other) | Open |
| 2026-09-30 | Repo is **public** (Netlify's free plan doesn't deploy private org repos). No secrets in code; `.env.local` git-ignored | Decided |
| 2026-09-30 | Workflow: Claude edits local clone; officer commits/pushes via GitHub Desktop | Decided |

---

## 11. Open questions
- Name of the 11th sector (mock data lists 10 from the spec).
- Real portfolio figures, allocations and holdings to publish.
- Names for the Vice President and Training Director placeholders on the Board.
- Who are the named admins for each service (§3)?
- Rice IT contact for the DNS change?
- Which emails receive contact-form submissions?
- Who manages the current Wix DNS record for `financegroup.rice.edu`?
