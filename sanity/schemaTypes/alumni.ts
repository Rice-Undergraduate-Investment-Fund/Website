import { LockIcon } from "@sanity/icons/Lock";
import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";
import { RUIF_ROLES, normalizeFirm } from "../../lib/content/types";

const SECTORS = [
  "Communication & Sports",
  "Consumer Goods",
  "Energy",
  "Financials",
  "Healthcare",
  "Industrials",
  "Natural Resources",
  "Portfolio Review",
  "Power, Utilities & Infrastructure",
  "Real Estate",
  "Technology",
];

/**
 * Alumni directory entry (members-only).
 *
 * PRIVACY: these documents must have IDs starting with "alumni." — Sanity never
 * serves documents whose ID contains a dot to anonymous visitors. Create them
 * with "Add alumnus" in the Alumni section (or the spreadsheet import), never
 * with the generic "+" button.
 */
export const alumnus = defineType({
  name: "alumnus",
  title: "Alumnus",
  type: "document",
  icon: UserIcon,
  validation: (rule) =>
    rule.custom((_, ctx) => {
      const id = ctx.document?._id?.replace(/^drafts\./, "") ?? "";
      return id.startsWith("alumni.")
        ? true
        : "This record would be public. Delete it and use “Add alumnus” in the Alumni section instead.";
    }),
  fields: [
    defineField({ name: "name", title: "Full name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "classYear",
      title: "Class",
      type: "number",
      description: "Graduation year, e.g. 2025.",
      validation: (r) => r.required().integer().min(2017).max(2040),
    }),
    defineField({
      name: "company",
      title: "Current company",
      type: "string",
      description: "Write it exactly as in Alumni Firms (e.g. “J.P. Morgan”) so it groups correctly.",
      validation: (r) =>
        r.custom(async (value, ctx) => {
          if (!value) return true;
          const names = await ctx
            .getClient({ apiVersion: "2025-09-01" })
            .fetch<string[]>(`*[_type == "alumniFirm"].name`);
          return names.some((n) => normalizeFirm(n) === normalizeFirm(value as string))
            ? true
            : "Not in Alumni Firms, so it will show under “Other”. Add the firm there if it belongs in a tab.";
        }).warning(),
    }),
    defineField({ name: "position", title: "Position", type: "string" }),
    defineField({ name: "location", type: "string", description: "e.g. New York, NY" }),
    defineField({
      name: "ruifRole",
      title: "Highest RUIF role",
      type: "string",
      options: { list: [...RUIF_ROLES] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "ruifSector", title: "RUIF sector", type: "string", options: { list: SECTORS } }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
    defineField({ name: "email", type: "string" }),
    defineField({
      name: "shareEmail",
      title: "Share email with members",
      type: "boolean",
      initialValue: false,
      description: "Only with the person's permission.",
    }),
    defineField({ name: "photo", type: "photo" }),
    defineField({ name: "notes", title: "Internal notes", type: "text", rows: 2, description: "Never shown on the site." }),
  ],
  orderings: [
    { title: "Class (newest)", name: "classDesc", by: [{ field: "classYear", direction: "desc" }, { field: "name", direction: "asc" }] },
    { title: "Name", name: "name", by: [{ field: "name", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", year: "classYear", company: "company", media: "photo" },
    prepare: ({ title, year, company, media }) => ({
      title,
      subtitle: [year ? `Class of ${year}` : null, company].filter(Boolean).join(" · "),
      media,
    }),
  },
});

/** Members-only password (ID "private.membersAccess", so it is never public). */
export const membersAccess = defineType({
  name: "membersAccess",
  title: "Members Password",
  type: "document",
  icon: LockIcon,
  fields: [
    defineField({
      name: "password",
      type: "string",
      description:
        "Password for the members-only Alumni Directory. Changing it signs everyone out; share the new one with members.",
      validation: (r) => r.required().min(6),
    }),
  ],
});
