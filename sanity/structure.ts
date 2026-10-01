import type { StructureResolver } from "sanity/structure";
import { ArchiveIcon } from "@sanity/icons/Archive";
import { StarIcon } from "@sanity/icons/Star";
import { UsersIcon } from "@sanity/icons/Users";

/** Studio sidebar, organized around the tasks officers actually do. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("RUIF Website")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site Settings")),
      S.listItem()
        .title("Training Program")
        .id("trainingProgram")
        .child(S.document().schemaType("trainingProgram").documentId("trainingProgram").title("Training Program")),
      S.listItem()
        .title("Portfolio")
        .id("portfolio")
        .child(S.document().schemaType("portfolio").documentId("portfolio").title("Portfolio")),
      S.divider(),

      S.listItem()
        .title("Board")
        .icon(StarIcon)
        .child(
          S.documentList()
            .title("Current Board")
            .schemaType("person")
            .filter('_type == "person" && status == "current" && defined(boardPosition) && boardPosition != ""')
            .defaultOrdering([{ field: "boardOrder", direction: "asc" }]),
        ),
      S.listItem()
        .title("Sectors")
        .schemaType("sector")
        .child(S.documentTypeList("sector").title("Sectors").defaultOrdering([{ field: "order", direction: "asc" }])),
      S.listItem()
        .title("Current Members")
        .icon(UsersIcon)
        .child(
          S.documentList()
            .title("Current Members")
            .schemaType("person")
            .filter('_type == "person" && status == "current"')
            .defaultOrdering([{ field: "name", direction: "asc" }]),
        ),
      S.listItem()
        .title("Alumni")
        .icon(ArchiveIcon)
        .child(
          S.documentList()
            .title("Alumni")
            .schemaType("person")
            .filter('_type == "person" && status == "alumni"')
            .defaultOrdering([{ field: "graduationYear", direction: "desc" }]),
        ),
      S.documentTypeListItem("person").title("All People"),
      S.divider(),

      S.documentTypeListItem("letter").title("Letters (PDF)"),
      S.listItem()
        .title("Holdings")
        .schemaType("holding")
        .child(S.documentTypeList("holding").title("Holdings").defaultOrdering([{ field: "company", direction: "asc" }])),
      S.documentTypeListItem("timelineEvent").title("History"),
    ]);
