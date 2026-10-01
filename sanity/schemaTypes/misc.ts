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
