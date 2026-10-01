import { ChartUpwardIcon } from "@sanity/icons/ChartUpward";
import { defineArrayMember, defineField, defineType } from "sanity";

export const sector = defineType({
  name: "sector",
  title: "Sector",
  type: "document",
  icon: ChartUpwardIcon,
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      description: "Used in links like /sectors#energy. Click “Generate”.",
      options: { source: "name", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "director",
      title: "Sector Director",
      type: "reference",
      to: [{ type: "person" }],
      options: { filter: 'status == "current"' },
    }),
    defineField({
      name: "members",
      type: "array",
      description: "Order doesn't matter: the site lists Senior Analysts, then Junior Analysts, each A–Z. Set each person's “Sector role”.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "person" }],
          options: { filter: 'status == "current"' },
        }),
      ],
      validation: (r) => r.unique(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "1 appears first on the Sectors page.",
    }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", director: "director.name", members: "members" },
    prepare: ({ title, director, members }) => ({
      title,
      subtitle: `${director ? `Director: ${director}` : "No director"} · ${members?.length ?? 0} members`,
    }),
  },
});
