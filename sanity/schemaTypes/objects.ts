import { defineField, defineType } from "sanity";

/** Image with alt text and hotspot. Used everywhere a photo appears. */
export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "image",
  options: { hotspot: true },
  description:
    "Tip: after uploading, click the crop icon to set the focal point (e.g. the person's face).",
  fields: [
    defineField({
      name: "alt",
      title: "Description (alt text)",
      type: "string",
      description: "Short description for screen readers, e.g. “Jane Smith, President”.",
    }),
  ],
});

export const step = defineType({
  name: "step",
  title: "Step",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const stat = defineType({
  name: "stat",
  title: "Statistic",
  type: "object",
  fields: [
    defineField({ name: "value", type: "string", description: "e.g. “140+”", validation: (r) => r.required() }),
    defineField({ name: "label", type: "string", description: "e.g. “Fund Members”", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});
