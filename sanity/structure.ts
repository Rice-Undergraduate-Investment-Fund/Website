import type { StructureResolver } from "sanity/structure";
import { AddIcon } from "@sanity/icons/Add";
import { ArchiveIcon } from "@sanity/icons/Archive";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { LockIcon } from "@sanity/icons/Lock";
import { WarningOutlineIcon } from "@sanity/icons/WarningOutline";
import { StarIcon } from "@sanity/icons/Star";
import { UsersIcon } from "@sanity/icons/Users";

/** Studio sidebar, organized around the tasks officers actually do. */
export const structure: StructureResolver = (S, context) =>
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
        .child(S.documentTypeList("sector").title("Sectors").defaultOrdering([{ field: "name", direction: "asc" }])),
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
        .title("Alumni Directory (members only)")
        .icon(ArchiveIcon)
        .child(
          S.list()
            .title("Alumni Directory")
            .items([
              S.listItem()
                .title("Add alumnus")
                .icon(AddIcon)
                // A fresh private ID ("alumni.…") each time, so the record is never public.
                .child(() =>
                  S.document().schemaType("alumnus").documentId(`alumni.${crypto.randomUUID()}`).title("New alumnus"),
                ),
              S.listItem()
                .title("All alumni")
                .schemaType("alumnus")
                .child(
                  S.documentTypeList("alumnus")
                    .title("All alumni")
                    .initialValueTemplates([])
                    .defaultOrdering([{ field: "classYear", direction: "desc" }, { field: "name", direction: "asc" }]),
                ),
              S.listItem()
                .title("By class")
                .icon(CalendarIcon)
                .child(async () => {
                  const years = await context
                    .getClient({ apiVersion: "2025-09-01" })
                    .fetch<number[]>(`array::unique(*[_type == "alumnus" && defined(classYear)].classYear) | order(@ desc)`);
                  return S.list()
                    .title("By class")
                    .items(
                      years.map((y) =>
                        S.listItem()
                          .id(`class-${y}`)
                          .title(`Class of ${y}`)
                          .child(
                            S.documentList()
                              .title(`Class of ${y}`)
                              .schemaType("alumnus")
                              .filter('_type == "alumnus" && classYear == $y')
                              .params({ y })
                              .initialValueTemplates([])
                              .defaultOrdering([{ field: "name", direction: "asc" }]),
                          ),
                      ),
                    );
                }),
              S.listItem()
                .title("Missing info")
                .icon(WarningOutlineIcon)
                .child(
                  S.documentList()
                    .title("Missing photo, company or LinkedIn")
                    .schemaType("alumnus")
                    .filter('_type == "alumnus" && (!defined(photo) || !defined(company) || !defined(linkedin))')
                    .initialValueTemplates([])
                    .defaultOrdering([{ field: "classYear", direction: "desc" }]),
                ),
              S.divider(),
              S.listItem()
                .title("Members password")
                .icon(LockIcon)
                .child(S.document().schemaType("membersAccess").documentId("private.membersAccess").title("Members password")),
            ]),
        ),
      S.documentTypeListItem("person").title("All People"),
      S.divider(),

      S.documentTypeListItem("letter").title("Letters (PDF)"),
      S.listItem()
        .title("Holdings")
        .schemaType("holding")
        .child(S.documentTypeList("holding").title("Holdings").defaultOrdering([{ field: "company", direction: "asc" }])),
      S.documentTypeListItem("timelineEvent").title("History"),
      S.listItem()
        .title("Alumni Firms (home page)")
        .schemaType("alumniFirm")
        .child(
          S.documentTypeList("alumniFirm")
            .title("Alumni Firms")
            .defaultOrdering([{ field: "industry", direction: "asc" }, { field: "tier", direction: "asc" }, { field: "name", direction: "asc" }]),
        ),
    ]);
