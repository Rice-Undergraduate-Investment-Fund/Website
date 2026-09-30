/**
 * Sanity connection settings.
 * The project ID and dataset are public identifiers (not secrets), so they
 * have safe defaults here. Environment variables can override them.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "237x8krw";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-09-01";
