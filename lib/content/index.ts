/**
 * Content access layer. Pages get ALL content through these functions.
 *
 * Source: Sanity (project/dataset in sanity/env.ts). If the dataset has not
 * been seeded yet (no Site Settings document) or Sanity can't be reached, the
 * seed content in ./data.ts is used instead, so the site always renders.
 */
import "server-only";
import { cache } from "react";
import { client, urlFor } from "@/sanity/lib/client";
import * as mock from "./data";
import type {
  Holding,
  ImageAsset,
  Person,
  Portfolio,
  SectorWithPeople,
  SiteSettings,
  TimelineEvent,
  TrainingProgram,
} from "./types";

export * from "./types";

/** How long (seconds) published CMS edits may take to appear on the live site. */
const REVALIDATE = 60;

// ---------------------------------------------------------------------------
// Sanity plumbing
// ---------------------------------------------------------------------------

async function query<T>(groq: string, params: Record<string, unknown> = {}): Promise<T> {
  return client.fetch<T>(groq, params, { next: { revalidate: REVALIDATE, tags: ["sanity"] } });
}

/** true = read from Sanity; false = use seed/fallback content. Memoized per request. */
const sanityEnabled = cache(async (): Promise<boolean> => {
  try {
    return await query<boolean>(`defined(*[_id == "siteSettings"][0]._id)`);
  } catch (err) {
    console.warn("[content] Sanity unreachable, using fallback content:", (err as Error).message);
    return false;
  }
});

/** GROQ projection for a `photo` field. */
const IMG = `{ alt, hotspot, crop, asset->{ _id, url, metadata { dimensions { width, height } } } }`;

type RawImage = {
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: unknown;
  asset?: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number } } };
} | null;

function toImage(img: RawImage | undefined, fallbackAlt = ""): ImageAsset | undefined {
  if (!img?.asset) return undefined;
  const dims = img.asset.metadata?.dimensions;
  return {
    src: urlFor(img).auto("format").url(),
    alt: img.alt || fallbackAlt,
    width: dims?.width ?? 1600,
    height: dims?.height ?? 1600,
    position: img.hotspot
      ? `${Math.round(img.hotspot.x * 100)}% ${Math.round(img.hotspot.y * 100)}%`
      : undefined,
  };
}

const PERSON = `{
  "id": _id, name, photo ${IMG}, email, linkedin, graduationYear, bio, status,
  boardPosition, boardOrder, employer, jobTitle, location, formerPosition, formerSector
}`;

type RawPerson = Omit<Person, "photo"> & { photo?: RawImage };

const toPerson = (p: RawPerson): Person => {
  const { photo, ...rest } = p;
  const clean = Object.fromEntries(Object.entries(rest).filter(([, v]) => v != null)) as Omit<Person, "photo">;
  return { ...clean, photo: toImage(photo, p.name) };
};

const arr = <T,>(x: T[] | null | undefined): T[] => x ?? [];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!(await sanityEnabled())) return mock.siteSettings;
  const s = await query<
    Omit<SiteSettings, "photos"> & { photos?: Record<keyof SiteSettings["photos"], RawImage> }
  >(`*[_id == "siteSettings"][0]{
    ..., photos {
      homeHero ${IMG}, homeFeature ${IMG}, homeTraining ${IMG},
      aboutHero ${IMG}, trainingHero ${IMG}, boardGroup ${IMG}
    }
  }`);
  const m = mock.siteSettings;
  const stat = (k: keyof SiteSettings["stats"]) => s.stats?.[k] ?? m.stats[k];
  return {
    orgName: s.orgName || m.orgName,
    shortName: s.shortName || m.shortName,
    tagline: s.tagline || m.tagline,
    intro: s.intro || m.intro,
    stats: {
      members: stat("members"),
      sectors: stat("sectors"),
      trainingStudents: stat("trainingStudents"),
      alumni: stat("alumni"),
    },
    mission: { heading: s.mission?.heading ?? "", pillars: arr(s.mission?.pillars) },
    operatingModel: arr(s.operatingModel),
    investmentProcess: arr(s.investmentProcess),
    alumniEmployers: arr(s.alumniEmployers),
    contacts: arr(s.contacts),
    socials: arr(s.socials),
    photos: {
      homeHero: toImage(s.photos?.homeHero),
      homeFeature: toImage(s.photos?.homeFeature),
      homeTraining: toImage(s.photos?.homeTraining),
      aboutHero: toImage(s.photos?.aboutHero),
      trainingHero: toImage(s.photos?.trainingHero),
      boardGroup: toImage(s.photos?.boardGroup),
    },
  };
}

export async function getSectors(): Promise<SectorWithPeople[]> {
  if (!(await sanityEnabled())) return mockSectors();
  const rows = await query<
    { id: string; name: string; slug: string; description?: string; order?: number; director?: RawPerson; members?: RawPerson[] }[]
  >(`*[_type == "sector" && defined(slug.current)] | order(coalesce(order, 999) asc, name asc) {
    "id": _id, name, "slug": slug.current, description, order,
    director-> ${PERSON},
    "members": members[]-> ${PERSON}
  }`);
  return rows.map((r, i) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description ?? "",
    order: r.order ?? i + 1,
    director: r.director ? toPerson(r.director) : undefined,
    members: arr(r.members).filter(Boolean).map(toPerson),
  }));
}

export async function getBoard(): Promise<Person[]> {
  if (!(await sanityEnabled())) {
    return mock.people
      .filter((p) => p.status === "current" && p.boardPosition)
      .sort((a, b) => (a.boardOrder ?? 99) - (b.boardOrder ?? 99));
  }
  const rows = await query<RawPerson[]>(
    `*[_type == "person" && status == "current" && defined(boardPosition) && boardPosition != ""]
      | order(coalesce(boardOrder, 99) asc, name asc) ${PERSON}`,
  );
  return rows.map(toPerson);
}

/** Alumni grouped by graduation year, newest first. */
export async function getAlumniByClass(): Promise<{ year: number; people: Person[] }[]> {
  const people = (await sanityEnabled())
    ? (await query<RawPerson[]>(
        `*[_type == "person" && status == "alumni" && defined(graduationYear)] | order(name asc) ${PERSON}`,
      )).map(toPerson)
    : mock.people.filter((p) => p.status === "alumni");

  const groups = new Map<number, Person[]>();
  for (const p of people) {
    if (!p.graduationYear) continue;
    groups.set(p.graduationYear, [...(groups.get(p.graduationYear) ?? []), p]);
  }
  return [...groups.entries()].sort(([a], [b]) => b - a).map(([year, people]) => ({ year, people }));
}

export async function getPortfolio(): Promise<Portfolio> {
  if (!(await sanityEnabled())) return mock.portfolio;
  const p = await query<Partial<Portfolio> | null>(
    `*[_id == "portfolio"][0]{ aum, returnSinceInception, inceptionYear, asOf, isSample, allocations[]{ sector, percent } }`,
  );
  return {
    aum: p?.aum ?? null,
    // Stored as a percentage in the CMS (24.5), used as a decimal here (0.245).
    returnSinceInception: p?.returnSinceInception != null ? p.returnSinceInception / 100 : null,
    inceptionYear: p?.inceptionYear ?? mock.portfolio.inceptionYear,
    asOf: p?.asOf,
    isSample: p?.isSample ?? false,
    allocations: arr(p?.allocations),
  };
}

export async function getFeaturedHoldings(): Promise<Holding[]> {
  if (!(await sanityEnabled())) return mock.holdings.filter((h) => h.featured);
  return query<Holding[]>(
    `*[_type == "holding" && featured == true] | order(coalesce(order, 999) asc, company asc) {
      "id": _id, company, ticker, "sector": coalesce(sector, ""), featured
    }`,
  );
}

export async function getTrainingProgram(): Promise<TrainingProgram> {
  if (!(await sanityEnabled())) return mock.trainingProgram;
  const t = await query<(Omit<TrainingProgram, "sessions"> & { sessions?: { title: string; description?: string }[] }) | null>(
    `*[_id == "trainingProgram"][0]{ semesterLabel, applicationsOpen, openDate, deadline, applyUrl, isSample, steps[]{title, description}, sessions[]{title, description} }`,
  );
  return {
    semesterLabel: t?.semesterLabel ?? "",
    applicationsOpen: t?.applicationsOpen ?? false,
    openDate: t?.openDate ?? undefined,
    deadline: t?.deadline ?? undefined,
    applyUrl: t?.applyUrl ?? undefined,
    isSample: t?.isSample ?? false,
    steps: arr(t?.steps).map((s) => ({ title: s.title, description: s.description ?? "" })),
    sessions: arr(t?.sessions).map((s, i) => ({ number: i + 1, title: s.title, description: s.description ?? "" })),
  };
}

export async function getTimeline(): Promise<TimelineEvent[]> {
  if (!(await sanityEnabled())) return mock.timeline;
  return query<TimelineEvent[]>(
    `*[_type == "timelineEvent"] | order(coalesce(order, 999) asc, year asc) { year, title, description }`,
  );
}

// ---------------------------------------------------------------------------
// Fallback helpers
// ---------------------------------------------------------------------------

function mockSectors(): SectorWithPeople[] {
  const byId = new Map(mock.people.map((p) => [p.id, p]));
  return [...mock.sectors]
    .sort((a, b) => a.order - b.order)
    .map(({ directorId, memberIds, ...s }) => ({
      ...s,
      director: directorId ? byId.get(directorId) : undefined,
      members: memberIds.map((id) => byId.get(id)).filter((p): p is Person => Boolean(p)),
    }));
}
