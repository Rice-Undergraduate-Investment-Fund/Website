import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/** Cookie that marks a browser as signed in to the members area. */
export const MEMBERS_COOKIE = "ruif_members";
export const MEMBERS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * The cookie value is an HMAC of the current password: it can't be forged
 * without knowing the password, and changing the password in the Studio
 * signs everyone out automatically.
 */
export function sessionToken(password: string) {
  return createHmac("sha256", password).update("ruif-members-v1").digest("hex");
}

export function isValidSession(cookieValue: string | undefined, password: string | null) {
  if (!cookieValue || !password) return false;
  const expected = Buffer.from(sessionToken(password));
  const given = Buffer.from(cookieValue);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function passwordMatches(input: string, password: string | null) {
  if (!password) return false;
  const a = Buffer.from(input.trim());
  const b = Buffer.from(password);
  return a.length === b.length && timingSafeEqual(a, b);
}
