"use client";

/**
 * Sanity Studio configuration, served at /studio.
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { privateTypes, schemaTypes, singletonTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "ruif",
  title: "RUIF Website",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "+ New document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Alumni must be created via "Add alumnus" (private ID), not the global "+" menu.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global" ? prev.filter((t) => !privateTypes.has(t.templateId)) : prev,
    // Singletons can't be deleted or duplicated.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : input,
  },
  plugins: [
    structureTool({ structure }),
    // GROQ query playground, useful for developers.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
