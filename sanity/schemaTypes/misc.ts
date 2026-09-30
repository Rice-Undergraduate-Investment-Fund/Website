import { CalendarIcon } from "@sanity/icons/Calendar";
import { TagIcon } from "@sanity/icons/Tag";
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
      title: "Show on Portfolio page",
      type: "boolean",
      initialValue: true,
    }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "company", ticker: "ticker", featured: "featured" },
    prepare: ({ title, ticker, featured }) => ({
      title,
      subtitle: `${ticker ?? ""}${featured ? "" : " · hidden"}`,
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
