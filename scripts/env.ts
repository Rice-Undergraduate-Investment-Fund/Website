/** Load .env.local (if present) so scripts can read SANITY_API_WRITE_TOKEN. */
try {
  process.loadEnvFile(".env.local");
} catch {
  // no .env.local: the script will explain what's missing
}
