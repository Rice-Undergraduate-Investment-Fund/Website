import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

/**
 * One record per person. Where they appear on the site is derived:
 *  - Board position filled + Current  → /people/board
 *  - Chosen as a sector's director or member → that sector
 *  - Status = Alumni → /people/alumni
 */
export const person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: UserIcon,
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "board", title: "Board" },
    { name: "alumni", title: "Alumni" },
  ],
  fields: [
    defineField({ name: "name", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({
      name: "photo",
      type: "photo",
      group: "main",
      description: "Square-friendly portrait works best. Set the focal point on the face.",
    }),
    defineField({
      name: "status",
      type: "string",
      group: "main",
      initialValue: "current",
      options: {
        list: [
          { title: "Current member", value: "current" },
          { title: "Alumni", value: "alumni" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sectorRole",
      title: "Sector role",
      type: "string",
      group: "main",
      description: "For sector members. (Sector Directors are chosen on the sector itself.)",
      options: {
        list: ["Senior Analyst", "Junior Analyst"],
        layout: "radio",
        direction: "horizontal",
      },
      hidden: ({ document }) => document?.status === "alumni",
    }),
    defineField({ name: "graduationYear", title: "Graduation year", type: "number", group: "main" }),
    defineField({ name: "email", type: "string", group: "main" }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url", group: "main" }),
    defineField({ name: "bio", type: "text", rows: 3, group: "main" }),

    defineField({
      name: "boardPosition",
      title: "Board position",
      type: "string",
      group: "board",
      description: "Fill in to show this person on the Board page (e.g. “President”). Leave empty otherwise.",
    }),
    defineField({
      name: "boardOrder",
      title: "Board display order",
      type: "number",
      group: "board",
      description: "1 appears first.",
      hidden: ({ document }) => !document?.boardPosition,
    }),

    defineField({ name: "employer", type: "string", group: "alumni" }),
    defineField({ name: "jobTitle", title: "Job title", type: "string", group: "alumni" }),
    defineField({ name: "location", type: "string", group: "alumni" }),
    defineField({ name: "formerPosition", title: "Former RUIF position", type: "string", group: "alumni" }),
    defineField({ name: "formerSector", title: "Former sector", type: "string", group: "alumni" }),
  ],
  orderings: [
    { title: "Name", name: "name", by: [{ field: "name", direction: "asc" }] },
    { title: "Board order", name: "boardOrder", by: [{ field: "boardOrder", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", position: "boardPosition", status: "status", year: "graduationYear", media: "photo" },
    prepare: ({ title, position, status, year, media }) => ({
      title,
      subtitle: [position, status === "alumni" ? `Alumni${year ? ` ’${String(year).slice(-2)}` : ""}` : null]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
