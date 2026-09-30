/**
 * TEMPORARY MOCK CONTENT
 *
 * Stand-in for Sanity until the CMS project exists. Anything marked
 * "placeholder" or `isSample: true` must be replaced with real content.
 * Real facts here come from the current financegroup.rice.edu site.
 */
import type {
  Holding,
  Person,
  Portfolio,
  Sector,
  SiteSettings,
  TimelineEvent,
  TrainingProgram,
} from "./types";

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

export const siteSettings: SiteSettings = {
  orgName: "Rice Undergraduate Investment Fund",
  shortName: "Rice Finance",
  tagline: "Rice University's Student-Run Investment Fund",
  intro:
    "RUIF gives Rice undergraduates a practical, hands-on education in finance. Members research public companies, pitch ideas and collectively manage a portion of the University's endowment.",
  stats: {
    members: { value: "140+", label: "Fund Members" },
    sectors: { value: "11", label: "Sectors" },
    trainingStudents: { value: "200+", label: "Training Program Students" },
    alumni: { value: "400+", label: "Alumni Since 2017" },
  },
  mission: {
    heading:
      "Our mission is to equip students with the skills to succeed in the finance industry.",
    pillars: [
      {
        title: "Practical & Goal-Oriented",
        description:
          "A practical and goal-oriented introduction to the world of finance and financial management.",
      },
      {
        title: "Hands-On Investing",
        description:
          "An unrivaled opportunity to manage a portion of the University's endowment, to invest as a team, and to learn by doing.",
      },
      {
        title: "Collaborative Decision-Making",
        description:
          "We manage real investments, and all decisions are made collectively.",
      },
    ],
  },
  operatingModel: [
    {
      title: "Training",
      description:
        "Seven sessions covering accounting, finance and valuation prepare new members for the fund.",
    },
    {
      title: "Sector Placement",
      description:
        "Graduates of the Training Program join one of the fund's sector teams.",
    },
    {
      title: "Equity Research",
      description:
        "Sector teams follow their industries and research individual companies.",
    },
    {
      title: "Pitch Day",
      description:
        "Members present stock ideas to the RUIF Board and investment professionals.",
    },
    {
      title: "Portfolio Decisions",
      description:
        "Approved ideas enter the portfolio, and positions are reviewed collectively.",
    },
  ],
  investmentProcess: [
    { title: "Research", description: "Sector teams build a thesis on a company." },
    { title: "Sector Discussion", description: "Ideas are debated within the sector." },
    { title: "Stock Pitch", description: "The strongest ideas are developed into a full pitch." },
    { title: "Pitch Day", description: "Pitches are presented to the Board and investment committee." },
    { title: "Portfolio Allocation", description: "Approved positions are sized and added to the portfolio." },
  ],
  alumniEmployers: [
    "Morgan Stanley",
    "J.P. Morgan",
    "Bank of America",
    "Lazard",
    "Point72",
  ],
  contacts: [
    { label: "General Inquiries" }, // placeholder: email to be added
    { label: "Training Program" }, // placeholder
    { label: "President" }, // placeholder
  ],
  socials: [],
};

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

const img = (
  src: string,
  alt: string,
  width = 1200,
  height = 1200,
  position?: string,
) => ({ src, alt, width, height, position });

/** Real board members with photos. */
const board: Person[] = [
  {
    id: "sergio-karam",
    name: "Sergio Karam",
    status: "current",
    boardPosition: "President",
    boardOrder: 1,
    photo: img("/images/sergio-karam.jpg", "Sergio Karam"),
  },
  {
    id: "board-vp",
    name: "Name TBD", // placeholder
    status: "current",
    boardPosition: "Vice President",
    boardOrder: 2,
  },
  {
    id: "board-training-1",
    name: "Name TBD", // placeholder
    status: "current",
    boardPosition: "Training Director",
    boardOrder: 3,
  },
  {
    id: "board-training-2",
    name: "Name TBD", // placeholder
    status: "current",
    boardPosition: "Training Director",
    boardOrder: 4,
  },
  {
    id: "sriram-chundi",
    name: "Sriram Chundi",
    status: "current",
    boardPosition: "Junior Training Director",
    boardOrder: 5,
    photo: img("/images/sriram-chundi.jpg", "Sriram Chundi"),
  },
];

const sectorNames = [
  "Technology",
  "Healthcare",
  "Financials",
  "Energy",
  "Industrials",
  "Consumer",
  "Communications",
  "Real Estate",
  "Natural Resources",
  "Power, Utilities & Infrastructure",
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Placeholder sector directors and members (no photos yet). */
const sectorPeople: Person[] = [];
const sectorsRaw: Sector[] = sectorNames.map((name, i) => {
  const slug = slugify(name);
  const directorId = `${slug}-director`;
  sectorPeople.push({ id: directorId, name: "Director Name", status: "current" });
  const memberCount = 6 + ((i * 5) % 7); // 6–12 placeholder members
  const memberIds = Array.from({ length: memberCount }, (_, m) => {
    const id = `${slug}-member-${m + 1}`;
    sectorPeople.push({ id, name: `Member ${m + 1}`, status: "current" });
    return id;
  });
  return {
    id: slug,
    name,
    slug,
    description: `The ${name} sector researches and covers public companies across the ${name.toLowerCase()} landscape.`, // placeholder
    directorId,
    memberIds,
    order: i + 1,
  };
});

/** Sample alumni for the demonstration Alumni page. */
const alumni: Person[] = [
  { id: "alum-1", name: "Alumni Name", status: "alumni", graduationYear: 2026, employer: "Morgan Stanley", jobTitle: "Investment Banking Analyst", location: "New York, NY" },
  { id: "alum-2", name: "Alumni Name", status: "alumni", graduationYear: 2026, employer: "Point72", jobTitle: "Research Associate", location: "Stamford, CT" },
  { id: "alum-3", name: "Alumni Name", status: "alumni", graduationYear: 2026, employer: "Lazard", jobTitle: "Financial Advisory Analyst", location: "Houston, TX" },
  { id: "alum-4", name: "Alumni Name", status: "alumni", graduationYear: 2025, employer: "J.P. Morgan", jobTitle: "Investment Banking Analyst", location: "Houston, TX" },
  { id: "alum-5", name: "Alumni Name", status: "alumni", graduationYear: 2025, employer: "Bank of America", jobTitle: "Global Markets Analyst", location: "New York, NY" },
  { id: "alum-6", name: "Alumni Name", status: "alumni", graduationYear: 2025, employer: "Consulting Firm", jobTitle: "Business Analyst", location: "Dallas, TX" },
  { id: "alum-7", name: "Alumni Name", status: "alumni", graduationYear: 2024, employer: "Private Equity Firm", jobTitle: "Associate", location: "New York, NY" },
  { id: "alum-8", name: "Alumni Name", status: "alumni", graduationYear: 2024, employer: "Morgan Stanley", jobTitle: "Associate", location: "San Francisco, CA" },
].map((p) => ({ ...p, status: "alumni" as const }));

export const people: Person[] = [...board, ...sectorPeople, ...alumni];
export const sectors: Sector[] = sectorsRaw;

// ---------------------------------------------------------------------------
// Portfolio (ILLUSTRATIVE – replace with real figures)
// ---------------------------------------------------------------------------

export const portfolio: Portfolio = {
  aum: null,
  returnSinceInception: null,
  inceptionYear: 2017,
  isSample: true,
  allocations: [
    { sector: "Technology", percent: 24 },
    { sector: "Healthcare", percent: 13 },
    { sector: "Financials", percent: 12 },
    { sector: "Energy", percent: 10 },
    { sector: "Industrials", percent: 9 },
    { sector: "Consumer", percent: 9 },
    { sector: "Communications", percent: 8 },
    { sector: "Real Estate", percent: 5 },
    { sector: "Power, Utilities & Infrastructure", percent: 5 },
    { sector: "Natural Resources", percent: 3 },
    { sector: "Cash", percent: 2 },
  ],
};

export const holdings: Holding[] = [
  { id: "msft", company: "Microsoft", ticker: "MSFT", sector: "Technology", featured: true },
  { id: "nvda", company: "NVIDIA", ticker: "NVDA", sector: "Technology", featured: true },
  { id: "googl", company: "Alphabet", ticker: "GOOGL", sector: "Communications", featured: true },
  { id: "lng", company: "Cheniere Energy", ticker: "LNG", sector: "Energy", featured: true },
];

// ---------------------------------------------------------------------------
// Training Program
// ---------------------------------------------------------------------------

export const trainingProgram: TrainingProgram = {
  semesterLabel: "Spring 2027", // placeholder
  applicationsOpen: true, // placeholder – drives the Apply button
  openDate: "TBD",
  deadline: "TBD",
  applyUrl: undefined, // placeholder – application form link
  isSample: true,
  steps: [
    { title: "Apply", description: "Submit a short application at the start of the semester." },
    { title: "Training Sessions", description: "Attend seven weekly sessions led by the Training Directors." },
    { title: "Complete Training", description: "Build core skills in accounting, valuation and markets." },
    { title: "Pitch Interview", description: "Present a stock pitch to demonstrate what you've learned." },
    { title: "Join a Sector", description: "Successful candidates are placed on a sector team." },
  ],
  sessions: [
    { number: 1, title: "Financial Statements", description: "Reading the income statement, balance sheet and cash flow statement." },
    { number: 2, title: "Accounting", description: "How transactions flow through the three statements." },
    { number: 3, title: "Valuation", description: "Relative valuation, multiples and comparable companies." },
    { number: 4, title: "DCF", description: "Building a discounted cash flow model from the ground up." },
    { number: 5, title: "Public Markets", description: "How markets work and how professional investors think." },
    { number: 6, title: "Stock Pitches", description: "Structuring an investment thesis and its risks." },
    { number: 7, title: "Pitch Preparation", description: "Refining and practicing your pitch for the interview." },
  ],
};

// ---------------------------------------------------------------------------
// History (placeholder milestones)
// ---------------------------------------------------------------------------

export const timeline: TimelineEvent[] = [
  { year: "2017", title: "Fund Founded", description: "RUIF is established at Rice University." },
  { year: "20XX", title: "Milestone", description: "Placeholder milestone." },
  { year: "20XX", title: "Milestone", description: "Placeholder milestone." },
  { year: "2026", title: "Today", description: "140+ members across 11 sectors." },
];
