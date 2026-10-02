import { type NextRequest, NextResponse } from "next/server";
import { MEMBERS_COOKIE } from "@/lib/members/session";

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/people/alumni", req.url), 303);
  res.cookies.delete(MEMBERS_COOKIE);
  return res;
}
