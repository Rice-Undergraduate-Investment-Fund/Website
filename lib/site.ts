/**
 * True only for the production build served on the real domain.
 * Netlify sets CONTEXT ("production" | "deploy-preview" | "branch-deploy")
 * and URL (the project's primary URL) at build time.
 *
 * Everywhere else (ruifwebsitev1.netlify.app, previews, localhost) the site
 * asks search engines not to index it. After making financegroup.rice.edu the
 * primary domain in Netlify, trigger one redeploy and indexing turns on.
 */
export const isLiveSite =
  process.env.CONTEXT === "production" &&
  (process.env.URL ?? "").includes("financegroup.rice.edu");
