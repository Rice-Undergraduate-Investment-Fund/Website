/**
 * Content types.
 *
 * These mirror the planned Sanity schemas (see docs/ARCHITECTURE.md §5).
 * Pages only ever talk to the functions in `lib/content/index.ts`, so when
 * Sanity is connected only the data source changes, not the pages.
 */

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position, e.g. "50% 30%" (Sanity: hotspot). */
  position?: string;
};

export type Person = {
  id: string;
  name: string;
  photo?: ImageAsset;
  email?: string;
  linkedin?: string;
  graduationYear?: number;
  bio?: string;
  status: "current" | "alumni";
  /** Set = appears on /people/board. */
  boardPosition?: string;
  boardOrder?: number;
  // Alumni fields
  employer?: string;
  jobTitle?: string;
  location?: string;
  formerPosition?: string;
  formerSector?: string;
};

export type Sector = {
  id: string;
  name: string;
  slug: string;
  description: string;
  directorId?: string;
  memberIds: string[];
  order: number;
};

/** A sector with its people resolved (what Sanity returns with `->` expansion). */
export type SectorWithPeople = Omit<Sector, "directorId" | "memberIds"> & {
  director?: Person;
  members: Person[];
};

export type Allocation = { sector: string; percent: number };

export type Portfolio = {
  /** Assets under management in USD. null = not yet published. */
  aum: number | null;
  /** Return since inception as a decimal (0.25 = +25%). */
  returnSinceInception: number | null;
  inceptionYear: number;
  asOf?: string;
  allocations: Allocation[];
  /** Draft flag: true while figures are illustrative placeholders. */
  isSample: boolean;
};

export type Holding = {
  id: string;
  company: string;
  ticker: string;
  sector: string;
  featured: boolean;
};

export type Step = { title: string; description: string };

export type TrainingSession = {
  number: number;
  title: string;
  description: string;
};

export type TrainingProgram = {
  semesterLabel: string;
  applicationsOpen: boolean;
  openDate?: string;
  deadline?: string;
  applyUrl?: string;
  steps: Step[];
  sessions: TrainingSession[];
  isSample: boolean;
};

export type TimelineEvent = {
  year: string;
  title: string;
  description?: string;
};

export type ContactEntry = { label: string; email?: string };

export type Stat = { value: string; label: string };

export type SiteSettings = {
  orgName: string;
  shortName: string;
  tagline: string;
  intro: string;
  stats: {
    members: Stat;
    sectors: Stat;
    trainingStudents: Stat;
    alumni: Stat;
  };
  mission: { heading: string; pillars: Step[] };
  operatingModel: Step[];
  investmentProcess: Step[];
  alumniEmployers: string[];
  contacts: ContactEntry[];
  socials: { label: string; url: string }[];
  photos: PagePhotos;
};

/** Large layout photos, editable in Site Settings → Page photos. */
export type PagePhotos = {
  homeHero?: ImageAsset;
  homeFeature?: ImageAsset;
  homeTraining?: ImageAsset;
  aboutHero?: ImageAsset;
  trainingHero?: ImageAsset;
  boardGroup?: ImageAsset;
};
