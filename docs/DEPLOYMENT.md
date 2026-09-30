# Deployment: GitHub → Netlify, with Sanity

## How the pieces fit

```text
             code (incl. Studio + schemas)                 content
Developer ──push──▶ GitHub ──auto build──▶ Netlify ◀──reads── Sanity (cloud)
                                             │                   ▲
                                             ▼                   │ edit + publish
                                  financegroup.rice.edu     Officers at /studio
```

- **There is only one deployment: GitHub → Netlify.** The Sanity Studio lives inside this repo (`/studio`), so it ships with the website on every push. Schema changes (new fields) deploy the same way.
- **Content is never deployed.** It lives in Sanity's cloud (project `237x8krw`, dataset `production`). The site reads it and refreshes it instantly via webhook, or within 60 seconds without one.
- **Nothing needs to be kept in sync by hand.** Push code → Netlify rebuilds. Publish content → site updates.

Build settings are pinned in `netlify.toml` (build command, Node 22). Netlify detects Next.js automatically and applies its Next.js runtime; no plugin needs installing.

## One-time setup

### 1. Netlify site
1. Log in at app.netlify.com with the **club-owned** account and use (or create) a **club team**, not a personal team, so it can be handed over.
2. **Add new project → Import an existing project → GitHub.**
   - If the org's repos don't appear, choose "Configure the Netlify app on GitHub" and grant it access to `Rice-Undergraduate-Investment-Fund`.
3. Pick `Website`. Netlify reads `netlify.toml`; keep the detected settings. Branch to deploy: `main`.
4. Environment variables: **none required.** Optional: `SANITY_REVALIDATE_SECRET` (step 3).
   Never add `SANITY_API_WRITE_TOKEN` to Netlify.
5. Deploy. Then **Project configuration → General → Change project name** to something like `ruifwebsitev1`, giving the URL `https://ruifwebsitev1.netlify.app`.

### 2. Sanity CORS origins (sanity.io/manage → API → CORS origins)
Add each with **Allow credentials** so the Studio can log in there:
- `https://ruifwebsitev1.netlify.app` (your production Netlify URL)
- `https://*--ruifwebsitev1.netlify.app` (Deploy Previews and branch deploys)
- `https://financegroup.rice.edu` (at launch)

### 3. Instant-update webhook (recommended)
1. Generate a long random string: `openssl rand -hex 32` in Terminal.
2. Netlify → Project configuration → **Environment variables → Add a variable**: `SANITY_REVALIDATE_SECRET` = that string (all deploy contexts). Then **Deploys → Trigger deploy** so it takes effect.
3. sanity.io/manage → API → **Webhooks → Create webhook**:
   - URL: `https://<production-domain>/api/revalidate`
   - Dataset: `production`; Trigger on: Create, Update, Delete
   - HTTP method: POST; Secret: the same string
4. Test: publish an edit in `/studio` and refresh the live site. The change should appear immediately.

### 4. GitHub
- Settings → Branches → protect `main` (require a pull request). Netlify builds a **Deploy Preview for every pull request** and posts its link on the PR; merge to deploy to production.
- Add at least one more owner to the GitHub org.

### 5. Sanity access for officers
sanity.io/manage → **Members → Invite**. Give officers the **Editor** role (content only). Keep 2+ Administrators.

### 6. Custom domain (at launch)
Netlify → **Domain management → Add a domain** → `financegroup.rice.edu`. Because the parent domain is Rice's, choose external DNS. Netlify shows the record to create (a **CNAME** from `financegroup` to `ruifwebsitev1.netlify.app`). Whoever manages the current Wix record (Rice IT or a past officer) switches it. Netlify then issues the HTTPS certificate automatically. Afterwards, add the domain to Sanity CORS (step 2) and update the webhook URL (step 3).

**Search indexing:** until then, the site tells search engines not to index it (`lib/site.ts`, `app/robots.ts`), so the Netlify draft never competes with the real site. Once `financegroup.rice.edu` is set as the **primary domain** in Netlify, trigger one redeploy (Deploys → Trigger deploy) and indexing switches on automatically. Also make sure **Visitor access** protection is off (Project configuration → Access & security).

## Day-to-day

| Change | Do this | Goes live |
|---|---|---|
| Names, photos, sectors, dates, portfolio numbers | Edit + **Publish** in `/studio` | Immediately (webhook) / ≤ 60 s |
| Design, layout, new features, new CMS fields | Branch → PR → check Deploy Preview → merge | A few minutes after merge |

## If something breaks
- **Build failed:** Netlify → Deploys → open the failed deploy's log. The previous version stays live until a build succeeds.
- **Site shows starter/placeholder content:** Sanity is unreachable or the dataset is private. Check Datasets → `production` is Public.
- **Studio login loops / CORS error:** the URL isn't in Sanity CORS origins with credentials.
- **Roll back:** Netlify → Deploys → pick a previous deploy → **Publish deploy**.
