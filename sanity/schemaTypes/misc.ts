import { CaseIcon } from "@sanity/icons/Case";
import { ALUMNI_INDUSTRIES } from "../../lib/content/types";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { TagIcon } from "@sanity/icons/Tag";
import { DocumentPdfIcon } from "@sanity/icons/DocumentPdf";
import { defineField, defineType } from "sanity";

export const holding = defineType({
  name: "holding",
  title: "Holding",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({ name: "company", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ticker", type: "string", validation: (r) => r.required() }),
    defineField({ name: "sector", type: "string" }),
    defineField({
      name: "featured",
      title: "Feature in “Selected positions”",
      type: "boolean",
      description: "All holdings appear in the full list; featured ones also get a card.",
      initialValue: false,
    }),
    defineField({
      name: "highlight",
      title: "Card highlight",
      type: "string",
      description: "Optional one-liner on the featured card, e.g. “+4,052% since purchase”.",
      hidden: ({ document }) => !document?.featured,
    }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "company", ticker: "ticker", featured: "featured" },
    prepare: ({ title, ticker, featured }) => ({
      title,
      subtitle: `${ticker ?? ""}${featured ? " · ★ featured" : ""}`,
    }),
  },
});

export const timelineEvent = defineType({
  name: "timelineEvent",
  title: "History milestone",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({ name: "year", type: "string", description: "e.g. “2017”", validation: (r) => r.required() }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({
      name: "linkText",
      title: "Link: words to link",
      type: "string",
      description: "Optional. Exact words from the description to turn into a link.",
    }),
    defineField({ name: "linkUrl", title: "Link: URL", type: "url", hidden: ({ document }) => !document?.linkText }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "year" } },
});

export const letter = defineType({
  name: "letter",
  title: "Letter",
  type: "document",
  icon: DocumentPdfIcon,
  description: "Semester letter (PDF). The newest one is shown on the Portfolio page.",
  fields: [
    defineField({ name: "title", type: "string", description: "e.g. “Fall 2026 RUIF Letter”", validation: (r) => r.required() }),
    defineField({ name: "semester", type: "string", description: "e.g. “Fall 2026”", validation: (r) => r.required() }),
    defineField({
      name: "publishedAt",
      title: "Published on",
      type: "date",
      description: "The most recent date is the one shown on the site.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Intro text",
      type: "text",
      rows: 3,
      description: "Shown next to the letter on the Portfolio page.",
    }),
    defineField({
      name: "file",
      title: "PDF",
      type: "file",
      options: { accept: "application/pdf" },
      validation: (r) => r.required(),
    }),
  ],
  orderings: [{ title: "Newest first", name: "publishedAt", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "publishedAt" } },
});

export const alumniFirm = defineType({
  name: "alumniFirm",
  title: "Alumni Firm",
  type: "document",
  icon: CaseIcon,
  description: "A firm shown in “Where RUIF members go” on the home page.",
  fields: [
    defineField({
      name: "name",
      type: "string",
      description: "As it's commonly written in finance, e.g. “J.P. Morgan”, “TPH&Co.”.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "industry",
      type: "string",
      options: { list: ALUMNI_INDUSTRIES.map((i) => ({ value: i.key, title: i.label })), layout: "radio" },
      description: "Which tab it appears under. A firm in two industries gets two entries.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tier",
      title: "Row",
      type: "number",
      options: {
        list: [
          { value: 1, title: "1 – top row (e.g. bulge brackets)" },
          { value: 2, title: "2 – second row (e.g. elite boutiques)" },
          { value: 3, title: "3 – third row (e.g. middle market)" },
          { value: 4, title: "4 – fourth row" },
        ],
        layout: "radio",
      },
      description: "Rows aren't labeled on the site; they just group firms of similar standing. Firms in a row are sorted A–Z.",
      initialValue: 1,
    }),
    defineField({ name: "showOnHome", title: "Show on home page", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Industry, row, name", name: "industryTier", by: [{ field: "industry", direction: "asc" }, { field: "tier", direction: "asc" }, { field: "name", direction: "asc" }] }],
  preview: {
    select: { title: "name", industry: "industry", tier: "tier" },
    prepare: ({ title, industry, tier }) => ({
      title,
      subtitle: `${ALUMNI_INDUSTRIES.find((i) => i.key === industry)?.label ?? "No industry"} · row ${tier ?? 1}`,
    }),
  },
});
