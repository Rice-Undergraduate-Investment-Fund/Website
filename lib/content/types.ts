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
  /** Small blurred placeholder (data URL) shown while the photo loads. */
  blurDataURL?: string;
};

export type SectorRole = "Senior Analyst" | "Junior Analyst";

export type Person = {
  id: string;
  name: string;
  photo?: ImageAsset;
  email?: string;
  linkedin?: string;
  graduationYear?: number;
  bio?: string;
  status: "current" | "alumni";
  /** Role within their sector team (Sector Directors are set on the sector). */
  sectorRole?: SectorRole;
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

export type PerformanceRow = {
  /** e.g. "Last 3 months" */
  period: string;
  /** Fund return, as a decimal (0.065 = +6.5%). */
  fund: number;
  /** Benchmark return, as a decimal. */
  benchmark: number;
};

export type Portfolio = {
  /** Assets under management in USD. null = not yet published. */
  aum: number | null;
  /** Return since inception as a decimal (0.25 = +25%). */
  returnSinceInception: number | null;
  inceptionYear: number;
  /** Free-text date label, e.g. "Fall 2026". */
  asOf?: string;
  allocations: Allocation[];
  /** Note shown above the figures (e.g. which numbers are estimates). */
  note?: string;
  /** Draft flag: shows a generic "figures pending" note if no custom note. */
  isSample: boolean;
  benchmarkName: string;
  performance: PerformanceRow[];
  beta?: number;
};

/** Semester letter to members (PDF), shown on the Portfolio page. */
export type Letter = {
  id: string;
  title: string;
  semester: string;
  publishedAt?: string;
  /** Short intro shown next to the embedded letter. */
  summary?: string;
  url: string;
  filename: string;
};

export type Holding = {
  id: string;
  company: string;
  ticker: string;
  sector: string;
  featured: boolean;
  /** Short highlight shown on featured cards, e.g. "+4,052% since purchase". */
  highlight?: string;
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
  /** Headline shown in place of the recruiting pitch while applications are closed. */
  closedMessage?: string;
  /** Training page "Apply" section while closed, e.g. "Fall 2026 applications are closed." */
  closedHeadline?: string;
  closedNote?: string;
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
  /** Optional: words in the description to turn into a link. */
  linkText?: string;
  linkUrl?: string;
};

export type ContactEntry = {
  label: string;
  email?: string;
  /** Optional link (website, LinkedIn…) and the text to show for it. */
  url?: string;
  urlLabel?: string;
};

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
  /** Mailing address, one line per row. */
  address?: string;
  socials: { label: string; url: string }[];
  photos: PagePhotos;
};

/** Large layout photos, editable in Site Settings → Page photos. */
export type PagePhotos = {
  homeHero?: ImageAsset;
  homeFeature?: ImageAsset;
  homeTraining?: ImageAsset;
  aboutHero?: ImageAsset;
  aboutMission?: ImageAsset;
  aboutFund?: ImageAsset;
  aboutHistory?: ImageAsset;
  trainingHero?: ImageAsset;
  /** Curriculum photos, beside sessions 1–2, 3–5 and 6–7. */
  trainingCurriculum1?: ImageAsset;
  trainingCurriculum2?: ImageAsset;
  trainingCurriculum3?: ImageAsset;
  portfolioHero?: ImageAsset;
  sectorsHero?: ImageAsset;
  boardGroup?: ImageAsset;
};

/** Industry tabs in "Where RUIF members go" (order = tab order). Keys are stored in Sanity. */
export const ALUMNI_INDUSTRIES = [
  { key: "ib", label: "Investment Banking" },
  { key: "pe", label: "Private Equity" },
  { key: "hf", label: "Hedge Funds & Trading" },
] as const;

export type AlumniIndustry = (typeof ALUMNI_INDUSTRIES)[number]["key"];

/** A firm where alumni work. `tier` = row within its industry (1 = top row); rows are unlabeled. */
export type AlumniFirm = {
  name: string;
  industry: AlumniIndustry;
  tier: number;
};

export type AlumniFirmGroup = {
  key: AlumniIndustry;
  label: string;
  /** Rows of firm names, top tier first, each row A–Z. */
  tiers: string[][];
};
