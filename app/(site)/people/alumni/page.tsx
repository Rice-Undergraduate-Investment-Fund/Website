import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AlumniDirectory } from "@/components/alumni/alumni-directory";
import { PageHeader } from "@/components/ui/blocks";
import { Container, Section } from "@/components/ui/layout";
import { getAlumniDirectory, getDirectoryFirms, getMembersPassword, membersAreaConfigured } from "@/lib/content";
import { isValidSession, MEMBERS_COOKIE } from "@/lib/members/session";

export const metadata: Metadata = {
  title: "Alumni Directory",
  robots: { index: false, follow: false },
};

export default async function AlumniPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, jar, password, configured] = await Promise.all([
    searchParams,
    cookies(),
    getMembersPassword(),
    membersAreaConfigured(),
  ]);
  const signedIn = isValidSession(jar.get(MEMBERS_COOKIE)?.value, password);

  return (
    <>
      <PageHeader
        eyebrow="Alumni"
        title="Alumni Directory"
        intro="A members-only directory of everyone who has been through RUIF. Browse by class or by company to find and reach alumni across the industry."
      />

      <Section>
        <Container>
          {signedIn ? (
            <>
              <AlumniDirectory alumni={await getAlumniDirectory()} firms={await getDirectoryFirms()} />
              <form action="/api/members/logout" method="post" className="mt-16 border-t border-line pt-6 text-right">
                <button type="submit" className="text-sm font-semibold text-slate underline-offset-4 hover:text-rice-blue hover:underline">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <div className="mx-auto max-w-md border border-line bg-white p-8 sm:p-10">
              <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-rice-blue uppercase">
                <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="5" y="11" width="14" height="10" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
                Members only
              </p>
              <h2 className="mt-4 text-3xl leading-tight text-rice-blue">Sign in to the directory</h2>
              <p className="mt-3 leading-relaxed text-slate">
                Enter the RUIF members password. Ask a Board member if you don&apos;t have it.
              </p>
              {!configured || !password ? (
                <p className="mt-6 text-sm text-slate">The members area is being set up. Please check back soon.</p>
              ) : (
                <form action="/api/members/login" method="post" className="mt-7">
                  <label className="block">
                    <span className="text-sm font-semibold text-ink">Password</span>
                    <input
                      type="password"
                      name="password"
                      required
                      autoComplete="current-password"
                      className="mt-2 block h-12 w-full border border-line bg-white px-4 text-ink focus:border-rice-blue focus:ring-1 focus:ring-rice-blue focus:outline-none"
                    />
                  </label>
                  {error && (
                    <p role="alert" className="mt-3 text-sm font-medium text-rice-blue">
                      That password isn&apos;t right. Please try again.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="mt-6 inline-flex h-12 w-full items-center justify-center bg-rice-blue text-sm font-semibold tracking-wide text-white transition-colors hover:bg-rich-blue"
                  >
                    Sign in
                  </button>
                </form>
              )}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
