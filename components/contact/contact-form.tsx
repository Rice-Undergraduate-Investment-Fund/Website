"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Contact form, submitted to Netlify Forms (definition in public/__forms.html).
 * Netlify stores each submission and emails it to the address set under
 * Site configuration → Forms → Form notifications.
 */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const field =
    "mt-2 block w-full border border-line bg-white px-4 py-3 text-ink transition-colors placeholder:text-rice-gray focus:border-rice-blue focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-rice-blue";
  const label = "text-sm font-semibold text-ink";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const data = new FormData(form);
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border-l-2 border-rice-blue bg-mist px-6 py-8 sm:px-8">
        <p className="font-serif text-2xl text-rice-blue">Inquiry successfully sent.</p>
        <p className="mt-2 text-slate">We will get back to you soon!</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-rice-blue underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form name="contact" className="grid gap-6" onSubmit={onSubmit}>
      <input type="hidden" name="form-name" value="contact" />
      {/* Honeypot: hidden from people, bots fill it in and Netlify discards the submission. */}
      <label className="hidden" aria-hidden>
        Company <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Name</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className={label}>Email</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block">
        <span className={label}>Subject</span>
        <input name="subject" required className={field} />
      </label>
      <label className="block">
        <span className={label}>Message</span>
        <textarea name="message" required rows={6} className={`${field} resize-y`} />
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status === "sending"} className="disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Send Message"}
        </Button>
        {status === "error" && (
          <p role="alert" className="text-sm text-slate">
            Something went wrong. Please try again, or email ricefinancegroup@gmail.com.
          </p>
        )}
      </div>
    </form>
  );
}
