/**
 * Content access layer.
 *
 * Every page reads content through these functions. They are async so they
 * match the Sanity client. When Sanity is connected, replace the bodies with
 * GROQ queries; the pages don't change.
 */
import * as data from "./data";
import type { Person, SectorWithPeople } from "./types";

export * from "./types";

const byId = new Map(data.people.map((p) => [p.id, p]));
const resolve = (id: string) => byId.get(id);

export async function getSiteSettings() {
  return data.siteSettings;
}

export async function getSectors(): Promise<SectorWithPeople[]> {
  return [...data.sectors]
    .sort((a, b) => a.order - b.order)
    .map(({ directorId, memberIds, ...s }) => ({
      ...s,
      director: directorId ? resolve(directorId) : undefined,
      members: memberIds.map(resolve).filter((p): p is Person => Boolean(p)),
    }));
}

export async function getBoard(): Promise<Person[]> {
  return data.people
    .filter((p) => p.status === "current" && p.boardPosition)
    .sort((a, b) => (a.boardOrder ?? 99) - (b.boardOrder ?? 99));
}

/** Alumni grouped by graduation year, newest first. */
export async function getAlumniByClass(): Promise<
  { year: number; people: Person[] }[]
> {
  const groups = new Map<number, Person[]>();
  for (const p of data.people) {
    if (p.status !== "alumni" || !p.graduationYear) continue;
    groups.set(p.graduationYear, [...(groups.get(p.graduationYear) ?? []), p]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, people]) => ({ year, people }));
}

export async function getPortfolio() {
  return data.portfolio;
}

export async function getFeaturedHoldings() {
  return data.holdings.filter((h) => h.featured);
}

export async function getTrainingProgram() {
  return data.trainingProgram;
}

export async function getTimeline() {
  return data.timeline;
}
