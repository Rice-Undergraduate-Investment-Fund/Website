import { BookIcon } from "@sanity/icons/Book";
import { CogIcon } from "@sanity/icons/Cog";
import { BarChartIcon } from "@sanity/icons/BarChart";
import { defineArrayMember, defineField, defineType } from "sanity";

/* One-of-a-kind documents. Editors change them but can't create or delete them. */

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "photos", title: "Page photos" },
    { name: "about", title: "About content" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({ name: "orgName", title: "Organization name", type: "string", group: "general" }),
    defineField({ name: "shortName", title: "Short name", type: "string", group: "general" }),
    defineField({ name: "tagline", type: "string", group: "general", description: "Main headline on the home page." }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 3, group: "general" }),
    defineField({
      name: "stats",
      title: "Key statistics",
      type: "object",
      group: "general",
      options: { collapsible: true },
      fields: [
        defineField({ name: "members", type: "stat" }),
        defineField({ name: "sectors", type: "stat" }),
        defineField({ name: "trainingStudents", title: "Training students", type: "stat" }),
        defineField({ name: "alumni", type: "stat" }),
      ],
    }),
    defineField({
      name: "alumniEmployers",
      title: "Alumni employers",
      type: "array",
      group: "general",
      of: [defineArrayMember({ type: "string" })],
      description: "Firm names shown under “Where RUIF members go”.",
    }),

    defineField({
      name: "photos",
      title: "Page photos",
      type: "object",
      group: "photos",
      description: "Large photos used across the site. Set the focal point so faces stay in frame.",
      fields: [
        defineField({ name: "homeHero", title: "Home: top banner", type: "photo" }),
        defineField({ name: "homeFeature", title: "Home: “Who we are” photo", type: "photo" }),
        defineField({ name: "homeTraining", title: "Home: Training Program photo", type: "photo" }),
        defineField({ name: "aboutHero", title: "About: top banner", type: "photo" }),
        defineField({ name: "aboutMission", title: "About: mission photo", type: "photo" }),
        defineField({ name: "aboutFund", title: "About: “A real fund” photo (blue section)", type: "photo" }),
        defineField({ name: "aboutHistory", title: "About: history photo", type: "photo" }),
        defineField({ name: "trainingHero", title: "Training Program: top banner", type: "photo" }),
        defineField({ name: "trainingCurriculum1", title: "Training Program: curriculum photo 1 (beside sessions 1–2)", type: "photo" }),
        defineField({ name: "trainingCurriculum2", title: "Training Program: curriculum photo 2 (beside sessions 3–5)", type: "photo" }),
        defineField({ name: "trainingCurriculum3", title: "Training Program: curriculum photo 3 (beside sessions 6–7)", type: "photo" }),
        defineField({ name: "portfolioHero", title: "Portfolio: top banner", type: "photo" }),
        defineField({ name: "sectorsHero", title: "Sectors: top banner", type: "photo" }),
        defineField({ name: "boardGroup", title: "Board: group photo", type: "photo" }),
      ],
    }),

    defineField({
      name: "mission",
      type: "object",
      group: "about",
      fields: [
        defineField({ name: "heading", type: "text", rows: 2 }),
        defineField({ name: "pillars", type: "array", of: [defineArrayMember({ type: "step" })] }),
      ],
    }),
    defineField({
      name: "operatingModel",
      title: "How we operate (steps)",
      type: "array",
      group: "about",
      of: [defineArrayMember({ type: "step" })],
    }),
    defineField({
      name: "investmentProcess",
      title: "Investment process (steps)",
      type: "array",
      group: "about",
      of: [defineArrayMember({ type: "step" })],
    }),

    defineField({
      name: "contacts",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "contact",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "email", type: "email" }),
            defineField({ name: "url", title: "Link", type: "url", description: "Optional, e.g. a LinkedIn page or website" }),
            defineField({ name: "urlLabel", title: "Link text", type: "string", description: "Shown instead of the raw link" }),
          ],
          preview: { select: { title: "label", subtitle: "email" } },
        }),
      ],
    }),
    defineField({
      name: "address",
      type: "text",
      rows: 3,
      group: "contact",
      description: "Shown on the Contact page. One line per row.",
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({ name: "label", type: "string", description: "e.g. LinkedIn" }),
            defineField({ name: "url", type: "url" }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});

export const portfolio = defineType({
  name: "portfolio",
  title: "Portfolio",
  type: "document",
  icon: BarChartIcon,
  fields: [
    defineField({
      name: "aum",
      title: "Assets under management (USD)",
      type: "number",
      description: "Whole dollars, e.g. 250000. Leave empty to show “$—”.",
    }),
    defineField({
      name: "returnSinceInception",
      title: "Return since inception (%)",
      type: "number",
      description: "Enter as a percentage, e.g. 24.5 for +24.5%.",
    }),
    defineField({ name: "inceptionYear", title: "Year established", type: "number", initialValue: 2017 }),
    defineField({ name: "asOf", title: "Figures as of", type: "string", description: "e.g. “Fall 2026”" }),
    defineField({
      name: "note",
      title: "Note shown with the figures",
      type: "text",
      rows: 2,
      description: "Optional, e.g. which figures are estimates. Leave empty to hide.",
    }),
    defineField({ name: "benchmarkName", title: "Benchmark", type: "string", initialValue: "VTI" }),
    defineField({ name: "beta", title: "Beta (5-year)", type: "number" }),
    defineField({
      name: "performance",
      title: "Performance vs. benchmark",
      type: "array",
      description: "Enter returns as percentages, e.g. 25.6 for +25.6%. Alpha is calculated automatically.",
      of: [
        defineArrayMember({
          type: "object",
          name: "performanceRow",
          fields: [
            defineField({ name: "period", type: "string", description: "e.g. “Last 12 months”", validation: (r) => r.required() }),
            defineField({ name: "fund", title: "Fund return (%)", type: "number", validation: (r) => r.required() }),
            defineField({ name: "benchmark", title: "Benchmark return (%)", type: "number", validation: (r) => r.required() }),
          ],
          preview: {
            select: { title: "period", fund: "fund", benchmark: "benchmark" },
            prepare: ({ title, fund, benchmark }) => ({ title, subtitle: `Fund ${fund ?? "–"}% · Benchmark ${benchmark ?? "–"}%` }),
          },
        }),
      ],
    }),
    defineField({
      name: "allocations",
      title: "Allocation by sector",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "allocation",
          fields: [
            defineField({ name: "sector", type: "string", validation: (r) => r.required() }),
            defineField({ name: "percent", title: "Percent of portfolio", type: "number", validation: (r) => r.required().min(0).max(100) }),
          ],
          preview: {
            select: { title: "sector", percent: "percent" },
            prepare: ({ title, percent }) => ({ title, subtitle: `${percent ?? 0}%` }),
          },
        }),
      ],
      validation: (r) =>
        r.custom((rows?: { percent?: number }[]) => {
          if (!rows?.length) return true;
          const total = rows.reduce((t, x) => t + (x.percent ?? 0), 0);
          return Math.abs(total - 100) < 0.51 ? true : `Allocations add up to ${total}%, not 100%.`;
        }).warning(),
    }),
    defineField({
      name: "isSample",
      title: "Show “figures pending” note",
      type: "boolean",
      description: "Turn off once real figures are entered.",
      initialValue: true,
    }),
  ],
  preview: { prepare: () => ({ title: "Portfolio" }) },
});

export const trainingProgram = defineType({
  name: "trainingProgram",
  title: "Training Program",
  type: "document",
  icon: BookIcon,
  groups: [
    { name: "recruiting", title: "Recruiting", default: true },
    { name: "program", title: "Program" },
  ],
  fields: [
    defineField({ name: "semesterLabel", title: "Recruiting semester", type: "string", group: "recruiting", description: "e.g. “Spring 2027”" }),
    defineField({
      name: "applicationsOpen",
      title: "Applications open?",
      type: "boolean",
      group: "recruiting",
      description: "On: Apply buttons are active. Off: they are shown greyed out and the message below replaces the recruiting headline.",
      initialValue: false,
    }),
    defineField({
      name: "closedMessage",
      title: "Message while applications are closed",
      type: "string",
      group: "recruiting",
      description: "e.g. “Application for the Spring 2027 Training Program will Open in Late Fall”",
      hidden: ({ document }) => Boolean(document?.applicationsOpen),
    }),
    defineField({
      name: "closedHeadline",
      title: "Training page: closed headline",
      type: "string",
      group: "recruiting",
      description: "e.g. “Fall 2026 applications are closed.”",
      hidden: ({ document }) => Boolean(document?.applicationsOpen),
    }),
    defineField({
      name: "closedNote",
      title: "Training page: closed note",
      type: "string",
      group: "recruiting",
      description: "e.g. “Check back in December for Spring 2027 applications.”",
      hidden: ({ document }) => Boolean(document?.applicationsOpen),
    }),
    defineField({ name: "openDate", title: "Applications open (date text)", type: "string", group: "recruiting", description: "e.g. “January 12, 2027”" }),
    defineField({ name: "deadline", title: "Deadline (date text)", type: "string", group: "recruiting" }),
    defineField({ name: "applyUrl", title: "Application form link", type: "url", group: "recruiting" }),
    defineField({
      name: "isSample",
      title: "Show “to be confirmed” note",
      type: "boolean",
      group: "recruiting",
      initialValue: false,
    }),
    defineField({ name: "steps", title: "How it works (steps)", type: "array", group: "program", of: [defineArrayMember({ type: "step" })] }),
    defineField({
      name: "sessions",
      title: "Curriculum sessions",
      type: "array",
      group: "program",
      description: "Numbered automatically in this order.",
      of: [defineArrayMember({ type: "step", title: "Session" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Training Program" }) },
});
