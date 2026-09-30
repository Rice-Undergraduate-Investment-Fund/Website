# RUIF Website — Architecture

> Living reference for how the Rice Undergraduate Investment Fund website is built, owned, and maintained.
> Source of product requirements: [`docs/SPEC.md`](SPEC.md). This file records the **technical decisions** that implement it.
> Update this file whenever an architectural decision changes.

**Repository:** https://github.com/Rice-Undergraduate-Investment-Fund/Website
**Production domain:** `financegroup.rice.edu`
**Last updated:** 2026-09-30 (initial scaffold)

---

## 1. Golden rule

> **Content change → Sanity**
> **Design / functionality change → GitHub → Vercel**

A new officer with no coding experience must be able to update the Board, sectors, photos, portfolio figures, recruiting dates and contact details **without touching GitHub**.

---

## 2. Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | Server components; static generation + on-demand revalidation |
| Language | TypeScript (strict) | |
| Styling | Tailwind CSS v4 | Design tokens defined once in `app/globals.css` (`@theme`), see §6 |
| CMS | Sanity | Studio embedded at `/studio` in the same repo |
| Hosting | Vercel | Preview deploy per PR, production on merge to `main` |
| Source control | GitHub org `Rice-Undergraduate-Investment-Fund` | Club-owned, not personal |
| Images | `next/image` (Sanity image CDN once connected) | Crop/hotspot set in Studio |
| Fonts | Source Serif 4 + Inter via Fontsource | Self-hosted, no external font requests |
| Contact form | Serverless route (`/api/contact`) + email service | Provider TBD (§10) |
| Analytics | Vercel Analytics | Optional; GA only if needed |
| Database | **None** | Add (e.g. Supabase) only for auth, voting, attendance, etc. |

### Data flow

```text
Officer edits in Sanity Studio ──publish──▶ Sanity Content Lake
                                                │ webhook
                                                ▼
Developer ──PR──▶ GitHub ──▶ Vercel build ◀── on-demand revalidation
                                │
                                ▼
                     financegroup.rice.edu
```

Published content appears on the live site within seconds via a Sanity webhook that triggers revalidation. No redeploy needed for content changes.

---

## 3. Ownership & access

All services are owned by the **club**, not an individual. Each should have **at least two admins** at all times.

| Service | Owner account | Admins (current) | Notes |
|---|---|---|---|
| GitHub org | Club org | _TBD_ | Branch protection on `main` |
| Sanity project | Club org / shared club login | _TBD_ | Officers get Editor role, not Admin |
| Vercel team | Club team / shared club login | _TBD_ | See §9 re: plan limits |
| DNS (`financegroup.rice.edu`) | Rice IT | Rice IT contact _TBD_ | CNAME to Vercel |
| Contact email service | Shared club login | _TBD_ | |

**Recommendation:** register Sanity, Vercel and any email service with a shared club email (not a personal `netID@rice.edu`), with credentials passed on at each leadership transition.

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
│   (planned: app/studio/ for embedded Sanity Studio, app/api/ for contact + revalidate)
├── components/
│   ├── ui/                   Primitives: Container, Section, SectionHeading, Button, PhotoHero, StatRow, ProcessSteps…
│   ├── layout/               Header (responsive nav, Apply button), Footer
│   ├── people/               PersonPhoto (square photo or placeholder), PersonCard
│   ├── sectors/              SectorDirectory (grid), SectorModal
│   ├── portfolio/            AllocationChart
│   └── contact/              ContactForm
├── lib/
│   ├── content/
│   │   ├── types.ts          Content types (mirror the Sanity schemas in §5)
│   │   ├── data.ts           TEMPORARY mock content, replaced by Sanity
│   │   └── index.ts          getSectors(), getBoard()… (the only thing pages call)
│   ├── images.ts             Site photography used in layouts
│   └── navigation.ts         Primary navigation (code-owned)
├── public/images/            Optimized photos + logo
├── docs/                     ARCHITECTURE.md, SPEC.md
└── AGENTS.md / CLAUDE.md     Instructions for AI coding assistants
```

### Content access layer
Pages never import data directly. They call async functions in `lib/content/index.ts` (e.g. `getSectors()` returns sectors with director and members resolved). Today these read `data.ts`; when Sanity is connected, only their bodies change to GROQ queries.

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
| status | `current` \| `alumni` | replaces separate Yes/No flags |
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
| `portfolio` | singleton | AUM, return since inception, inception year, as-of date, allocations `[{sector, percent}]` |
| `holding` | document | company, ticker, logo, sector, featured? |
| `trainingProgram` | singleton | semester label, applications open?, open date, deadline, apply URL, steps, sessions `[{number, title, description}]` |
| `timelineEvent` | document | year, title, description (About → history) |
| `siteSettings` | singleton | org stats (members, sectors, alumni), contact emails, social links, show Apply button? |

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
branch → commit → pull request → Vercel preview URL → review → merge to main → production deploy
```

- `main` is protected: changes arrive via PR only.
- Every PR gets a preview URL. Check mobile and desktop before merging.
- Secrets live only in Vercel environment variables and a local `.env.local` (git-ignored).

### Environment variables
| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_READ_TOKEN` | Draft preview (optional) |
| `SANITY_REVALIDATE_SECRET` | Verifies webhook calls |
| `CONTACT_*` | Contact form provider keys |

---

## 9. Hosting notes

- **Vercel plan:** Vercel's free Hobby plan has historically not supported deploying **private repositories owned by a GitHub organization**. Options: (a) make the repo public, which is fine for a club site if no secrets are committed; (b) Vercel Pro; (c) ask about education/nonprofit credits. Check this against current Vercel docs when connecting.
- **Domain:** `financegroup.rice.edu` already points to an external host (Wix), so external hosting is established. At launch the DNS record must be switched from Wix to Vercel by whoever manages it (Rice IT or the officer who set up Wix) — identify them before launch.

---

## 10. Decision log

| Date | Decision | Status |
|---|---|---|
| 2026-09-30 | Stack: Next.js + TS + Tailwind + Sanity + Vercel | Decided (spec) |
| 2026-09-30 | GitHub org `Rice-Undergraduate-Investment-Fund` created, repo `Website` | Done |
| 2026-09-30 | Colors: official Rice Blue `#00205B` / white / black | Decided |
| 2026-09-30 | Sanity Studio embedded at `/studio` in the same repo | Proposed |
| 2026-09-30 | Tailwind v4: tokens in `globals.css`, no `tailwind.config.ts` | Done |
| 2026-09-30 | Fonts: Source Serif 4 + Inter, self-hosted | Done (revisable) |
| 2026-09-30 | Typed mock content layer until Sanity exists | Done |
| 2026-09-30 | Sector membership stored on `sector`, not `person` | Proposed |
| — | Contact form provider (Resend / Formspree / other) | Open |
| 2026-09-30 | Repo goes public if Vercel's plan requires it for org repos | Decided |
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
