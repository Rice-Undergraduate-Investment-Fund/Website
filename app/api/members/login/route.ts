/**
 * Members sign-in for the Alumni Directory (shared password).
 * The password is set in the Studio: Alumni Directory → Members password.
 */
import { type NextRequest, NextResponse } from "next/server";
import { getMembersPassword } from "@/lib/content";
import { MEMBERS_COOKIE, MEMBERS_COOKIE_MAX_AGE, passwordMatches, sessionToken } from "@/lib/members/session";

const DIRECTORY = "/people/alumni";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const input = String(form.get("password") ?? "");
  const password = await getMembersPassword();

  if (!passwordMatches(input, password)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return NextResponse.redirect(new URL(`${DIRECTORY}?error=1`, req.url), 303);
  }

  const res = NextResponse.redirect(new URL(DIRECTORY, req.url), 303);
  res.cookies.set(MEMBERS_COOKIE, sessionToken(password!), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MEMBERS_COOKIE_MAX_AGE,
  });
  return res;
}
