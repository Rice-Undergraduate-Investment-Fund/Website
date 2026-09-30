"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Contact form UI. Submission is not connected yet. The backend (serverless
 * route + email provider) is an open decision in docs/ARCHITECTURE.md.
 */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "not-connected">("idle");

  const field =
    "mt-2 block w-full border border-line bg-white px-4 py-3 text-ink transition-colors placeholder:text-rice-gray focus:border-rice-blue focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-rice-blue";
  const label = "text-sm font-semibold text-ink";

  return (
    <form
      className="grid gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("not-connected");
      }}
    >
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
        <Button type="submit">Send Message</Button>
        <p role="status" className="text-sm text-slate">
          {status === "not-connected" &&
            "Thanks! The contact form isn't connected yet in this draft, so your message was not sent."}
        </p>
      </div>
    </form>
  );
}
