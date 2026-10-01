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
  Letter,
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
  "id": _id, name, photo ${IMG}, email, linkedin, graduationYear, bio, status, sectorRole,
  boardPosition, boardOrder, employer, jobTitle, location, formerPosition, formerSector
}`;

type RawPerson = Omit<Person, "photo"> & { photo?: RawImage };

const toPerson = (p: RawPerson): Person => {
  const { photo, ...rest } = p;
  const clean = Object.fromEntries(Object.entries(rest).filter(([, v]) => v != null)) as Omit<Person, "photo">;
  return { ...clean, photo: toImage(photo, p.name) };
};

const arr = <T,>(x: T[] | null | undefined): T[] => x ?? [];

/** Sector members: Senior Analysts, then Junior Analysts, then anyone else; A–Z within each. */
const ROLE_RANK: Record<string, number> = { "Senior Analyst": 0, "Junior Analyst": 1 };
export const sortMembers = (people: Person[]) =>
  [...people].sort(
    (a, b) =>
      (ROLE_RANK[a.sectorRole ?? ""] ?? 2) - (ROLE_RANK[b.sectorRole ?? ""] ?? 2) ||
      a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
  );

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
  >(`*[_type == "sector" && defined(slug.current)] | order(lower(name) asc) {
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
    members: sortMembers(arr(r.members).filter(Boolean).map(toPerson)),
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
  const p = await query<
    (Omit<Partial<Portfolio>, "performance"> & { performance?: { period: string; fund: number; benchmark: number }[] }) | null
  >(
    `*[_id == "portfolio"][0]{
      aum, returnSinceInception, inceptionYear, asOf, note, isSample, benchmarkName, beta,
      allocations[]{ sector, percent }, performance[]{ period, fund, benchmark }
    }`,
  );
  // Percentages are stored as the editor types them (24.5) and used as decimals here (0.245).
  const pct = (n: number | null | undefined) => (n != null ? n / 100 : null);
  return {
    aum: p?.aum ?? null,
    returnSinceInception: pct(p?.returnSinceInception),
    inceptionYear: p?.inceptionYear ?? mock.portfolio.inceptionYear,
    // Older documents stored a date here; show only text labels.
    asOf: typeof p?.asOf === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(p.asOf) ? p.asOf : undefined,
    note: p?.note ?? undefined,
    isSample: p?.isSample ?? false,
    benchmarkName: p?.benchmarkName || "VTI",
    beta: p?.beta ?? undefined,
    allocations: arr(p?.allocations),
    performance: arr(p?.performance).map((r) => ({ period: r.period, fund: r.fund / 100, benchmark: r.benchmark / 100 })),
  };
}

const HOLDING = `{ "id": _id, company, ticker, "sector": coalesce(sector, ""), "featured": featured == true, highlight }`;
const cleanHolding = (h: Holding): Holding => ({ ...h, highlight: h.highlight ?? undefined });

export async function getFeaturedHoldings(): Promise<Holding[]> {
  if (!(await sanityEnabled())) return mock.holdings.filter((h) => h.featured);
  return (
    await query<Holding[]>(`*[_type == "holding" && featured == true] | order(coalesce(order, 999) asc, company asc) ${HOLDING}`)
  ).map(cleanHolding);
}

/** All holdings grouped by sector (sectors sorted A–Z, companies A–Z). */
export async function getHoldingsBySector(): Promise<{ sector: string; holdings: Holding[] }[]> {
  const all = (await sanityEnabled())
    ? (await query<Holding[]>(`*[_type == "holding"] | order(company asc) ${HOLDING}`)).map(cleanHolding)
    : [...mock.holdings].sort((a, b) => a.company.localeCompare(b.company));
  const groups = new Map<string, Holding[]>();
  for (const h of all) groups.set(h.sector || "Other", [...(groups.get(h.sector || "Other") ?? []), h]);
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([sector, holdings]) => ({ sector, holdings }));
}

/** Newest semester letter (PDF), if any. */
export async function getLatestLetter(): Promise<Letter | null> {
  if (!(await sanityEnabled())) return mock.letters[0] ?? null;
  const l = await query<{ id: string; title: string; semester: string; publishedAt?: string; summary?: string; url?: string; originalFilename?: string } | null>(
    `*[_type == "letter" && defined(file.asset)] | order(publishedAt desc)[0]{
      "id": _id, title, semester, publishedAt, summary, "url": file.asset->url, "originalFilename": file.asset->originalFilename
    }`,
  );
  if (!l?.url) return null;
  return {
    id: l.id,
    title: l.title,
    semester: l.semester,
    publishedAt: l.publishedAt,
    summary: l.summary ?? undefined,
    url: l.url,
    filename: l.originalFilename || `${l.title}.pdf`,
  };
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
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ directorId, memberIds, ...s }) => ({
      ...s,
      director: directorId ? byId.get(directorId) : undefined,
      members: sortMembers(memberIds.map((id) => byId.get(id)).filter((p): p is Person => Boolean(p))),
    }));
}
