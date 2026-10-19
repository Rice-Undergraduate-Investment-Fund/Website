import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { PhotoHero } from "@/components/ui/blocks";
import { Container, Section } from "@/components/ui/layout";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const s = await getSiteSettings();
  return (
    <>
      <PhotoHero image={s.photos.contactHero} title="Contact Rice Finance">
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 text-pretty">
          Have a question about Rice Finance, the Training Program, the portfolio, or working with RUIF? We&apos;d
          love to hear from you.
        </p>
      </PhotoHero>
      <Section>
        <Container className="grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
          <dl className="space-y-8">
            {s.contacts.map((c) => (
              <div key={c.label} className="border-t border-line pt-5">
                <dt className="text-xs font-semibold tracking-[0.2em] text-rice-blue uppercase">{c.label}</dt>
                {c.url && (
                  <dd className="mt-2 font-serif text-xl">
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-ink underline-offset-4 hover:underline"
                    >
                      {c.urlLabel || c.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                      <span aria-hidden className="text-base text-rice-blue">↗</span>
                    </a>
                  </dd>
                )}
                {c.email && (
                  <dd className={c.url ? "mt-1 text-slate" : "mt-2 font-serif text-xl"}>
                    <a href={`mailto:${c.email}`} className="text-ink underline-offset-4 hover:underline">
                      {c.email}
                    </a>
                  </dd>
                )}
                {!c.url && !c.email && <dd className="mt-2 font-serif text-xl text-slate">Email to be added</dd>}
              </div>
            ))}
            {s.address && (
              <div className="border-t border-line pt-5">
                <dt className="text-xs font-semibold tracking-[0.2em] text-rice-blue uppercase">Address</dt>
                <dd className="mt-2 font-serif text-xl leading-snug whitespace-pre-line text-ink">
                  <address className="not-italic">{s.address}</address>
                </dd>
              </div>
            )}
          </dl>
          <div>
            <h2 className="text-2xl text-rice-blue sm:text-3xl">Send us a message</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
