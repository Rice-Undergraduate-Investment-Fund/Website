/**
 * SEED / FALLBACK CONTENT
 *
 * Used (1) by `npm run seed` to fill an empty Sanity dataset, and (2) as a
 * fallback while the dataset is empty or unreachable. Anything marked
 * "placeholder" or `isSample: true` must be replaced with real content.
 * Real facts here come from the current financegroup.rice.edu site.
 */
import type {
  Holding,
  Letter,
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
  photos: {
    homeHero: { src: "/images/board-2026-wide.jpg", alt: "The 2026–27 RUIF Board", width: 2400, height: 1500, position: "50% 18%" },
    homeFeature: { src: "/images/president-vp.jpg", alt: "RUIF President and Vice President", width: 1600, height: 2400, position: "50% 62%" },
    homeTraining: { src: "/images/training-directors-wide.jpg", alt: "RUIF Training Directors", width: 2400, height: 1500, position: "55% 20%" },
    aboutHero: { src: "/images/president-vp-wide.jpg", alt: "RUIF President and Vice President", width: 2400, height: 1500, position: "55% 20%" },
    trainingHero: { src: "/images/training-directors-wide.jpg", alt: "RUIF Training Directors", width: 2400, height: 1500, position: "55% 20%" },
    boardGroup: { src: "/images/board-2026-wide.jpg", alt: "The 2026–27 RUIF Board", width: 2400, height: 1500, position: "50% 60%" },
  },
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

// Fall 2026 roster, from the organization chart in the Fall 2026 RUIF Letter.

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const board: Person[] = [
  {
    id: "sergio-karam",
    name: "Sergio Karam",
    status: "current",
    boardPosition: "President",
    boardOrder: 1,
    photo: img("/images/sergio-karam.jpg", "Sergio Karam"),
  },
  { id: "tomas-hradil", name: "Tomas Hradil", status: "current", boardPosition: "Vice President", boardOrder: 2 },
  {
    id: "sriram-chundi",
    name: "Sriram Chundi",
    status: "current",
    boardPosition: "Training Program Director",
    boardOrder: 3,
    photo: img("/images/sriram-chundi.jpg", "Sriram Chundi"),
  },
  { id: "kenneth-manning", name: "Kenneth Manning", status: "current", boardPosition: "Training Program Director", boardOrder: 4 },
  { id: "rahul-herrero", name: "Rahul Herrero", status: "current", boardPosition: "Training Program Director", boardOrder: 5 },
];

type Roster = { name: string; director: string; senior: string[]; junior: string[]; description: string };

const roster: Roster[] = [
  {
    name: "Technology",
    director: "Ethan Yuen",
    senior: ["Dylan Uttamchandani", "Emma Yuan"],
    junior: ["Jacob Davila", "Jay Kothari", "Hemanth Konda", "Daiwei Wang"],
    description: "Covers software, semiconductors and internet infrastructure, from early AI winners to cloud platforms.",
  },
  {
    name: "Healthcare",
    director: "Teo Lehaczynski",
    senior: ["Eddy Zhang", "Vishwas Vijayan", "Atish Amistapur", "Dia Gupta", "Marco de Azevedo Soares"],
    junior: ["Annie Chen", "Grace Yuan"],
    description: "Covers insurers, pharmaceuticals, biotech and medical devices.",
  },
  {
    name: "Financials",
    director: "Kirill Kolotiy",
    senior: ["Jonathan Plavnik", "Jude Thomas"],
    junior: ["Hans Zhu", "Wesley Liu", "Noah Kaufman"],
    description: "Covers banks, payments, exchanges and alternative asset managers.",
  },
  {
    name: "Energy",
    director: "Landon Nickel",
    senior: ["Varun Gite", "James Wang", "Clarence Wang", "Eric Lu"],
    junior: ["Dhruv Koka", "Tony Wang", "Sriram Birur", "Blaise Martinez"],
    description: "Covers oil and gas producers, LNG, midstream and oilfield services.",
  },
  {
    name: "Natural Resources",
    director: "Ellis Vance",
    senior: ["Benjamin Viafore", "Jason Fu", "Kyle Chen"],
    junior: ["Ian Vazquez", "Varun Khanna", "Muhammad Hassan Ebad", "Viola Cullen"],
    description: "Covers metals and mining, fertilizers, uranium and integrated resource companies.",
  },
  {
    name: "Industrials",
    director: "William Theiss",
    senior: ["Daniel Rodas", "Cecilia Wang", "Frankie Fu"],
    junior: ["Teddy Staebler", "Amy Li", "Warren Chang"],
    description: "Covers aerospace and defense, machinery, waste management and building products.",
  },
  {
    name: "Consumer Goods",
    director: "Kevin Sun",
    senior: ["Neil Patel", "Nma Moghalu", "Winston Zhao", "Juliana Zhou"],
    junior: ["Tibet Ozum", "Jasmine Cheng"],
    description: "Covers retailers and consumer brands with resilient business models.",
  },
  {
    name: "Communication & Sports",
    director: "Ryan Ginn",
    senior: ["Samantha Zhang", "Molly Chen", "Tim Alechkevitch"],
    junior: ["Lamiah Haroon", "Mckayla Childs", "Maemi Carillo-Inagaki", "Enrique Almeida Davila"],
    description: "Covers media, entertainment, telecom, advertising and sports.",
  },
  {
    name: "Real Estate",
    director: "Krish Puri",
    senior: ["Mykhaylo Negrych", "Lukas Johnson", "Conor Orchard", "Sebastian Tirschwell"],
    junior: ["Jack Lu", "Alina Chen", "Anderson Zeidenstein"],
    description: "Covers REITs across residential, industrial, healthcare and experiential properties.",
  },
  {
    name: "Power, Utilities & Infrastructure",
    director: "Abe Fang",
    senior: ["Gavin Nguyen", "Robert Fischer", "Arya Agarwal"],
    junior: ["Judy Tsai", "Tomas Jiang", "James Wu", "Rex Rutchik"],
    description: "RUIF's newest sector (Fall 2026), covering power generation, utilities and infrastructure.",
  },
  {
    name: "Portfolio Review",
    director: "Emily Yang",
    senior: ["Elias Sikavitsas", "Caelyn Wang", "Yiqian Wang", "Lindsey Huang", "Mehul Menon", "William Liu"],
    junior: [],
    description: "Reviews the fund's positions, performance and risk, and writes the semester portfolio review.",
  },
];

const sectorPeople: Person[] = [];
const person = (name: string, sectorRole?: Person["sectorRole"]): string => {
  const id = slugify(name);
  if (!sectorPeople.some((p) => p.id === id)) sectorPeople.push({ id, name, status: "current", sectorRole });
  return id;
};

const sectorsRaw: Sector[] = roster.map((r, i) => {
  const slug = slugify(r.name);
  return {
    id: slug,
    name: r.name,
    slug,
    description: r.description,
    directorId: person(r.director),
    memberIds: [...r.senior.map((n) => person(n, "Senior Analyst")), ...r.junior.map((n) => person(n, "Junior Analyst"))],
    order: i + 1,
  };
});

/** Sample alumni for the demonstration Alumni page. */
const alumni: Person[] = [
  { id: "placeholder-alum-1", name: "Alumni Name", status: "alumni", graduationYear: 2026, employer: "Morgan Stanley", jobTitle: "Investment Banking Analyst", location: "New York, NY" },
  { id: "placeholder-alum-2", name: "Alumni Name", status: "alumni", graduationYear: 2026, employer: "Point72", jobTitle: "Research Associate", location: "Stamford, CT" },
  { id: "placeholder-alum-3", name: "Alumni Name", status: "alumni", graduationYear: 2026, employer: "Lazard", jobTitle: "Financial Advisory Analyst", location: "Houston, TX" },
  { id: "placeholder-alum-4", name: "Alumni Name", status: "alumni", graduationYear: 2025, employer: "J.P. Morgan", jobTitle: "Investment Banking Analyst", location: "Houston, TX" },
  { id: "placeholder-alum-5", name: "Alumni Name", status: "alumni", graduationYear: 2025, employer: "Bank of America", jobTitle: "Global Markets Analyst", location: "New York, NY" },
  { id: "placeholder-alum-6", name: "Alumni Name", status: "alumni", graduationYear: 2025, employer: "Consulting Firm", jobTitle: "Business Analyst", location: "Dallas, TX" },
  { id: "placeholder-alum-7", name: "Alumni Name", status: "alumni", graduationYear: 2024, employer: "Private Equity Firm", jobTitle: "Associate", location: "New York, NY" },
  { id: "placeholder-alum-8", name: "Alumni Name", status: "alumni", graduationYear: 2024, employer: "Morgan Stanley", jobTitle: "Associate", location: "San Francisco, CA" },
].map((p) => ({ ...p, status: "alumni" as const }));

export const people: Person[] = [...board, ...sectorPeople, ...alumni];
export const sectors: Sector[] = sectorsRaw;

// ---------------------------------------------------------------------------
// Portfolio: from the Fall 2026 RUIF Letter (public/letters/ruif-letter-fall-2026.pdf)
// ---------------------------------------------------------------------------

export const portfolio: Portfolio = {
  aum: 70000, // letter: "approximately $70,000 currently under management"
  returnSinceInception: 1.305, // performance table, MAX: 130.5%
  inceptionYear: 2017,
  asOf: "Fall 2026",
  isSample: false,
  note: "Figures from the Fall 2026 letter. Allocation from the holdings report of August 26, 2026.",
  benchmarkName: "VTI",
  beta: 1.11, // 5-year beta vs VTI
  performance: [
    { period: "Last 3 months", fund: 0.065, benchmark: 0.024 },
    { period: "Last 12 months", fund: 0.256, benchmark: 0.189 },
    { period: "Last 2 years", fund: 0.61, benchmark: 0.4 },
    { period: "Since inception", fund: 1.305, benchmark: 1.66 },
  ],
  // From the RUIF Portfolio Holdings report, August 26, 2026 (fund weights by sector, incl. cash).
  allocations: [
    { sector: "Technology", percent: 28.9 },
    { sector: "Communication Services", percent: 11.6 },
    { sector: "Consumer Goods", percent: 10.3 },
    { sector: "Financials", percent: 10.0 },
    { sector: "Energy", percent: 8.1 },
    { sector: "Cash", percent: 6.8 },
    { sector: "Natural Resources", percent: 6.7 },
    { sector: "Healthcare", percent: 6.7 },
    { sector: "Industrials", percent: 6.6 },
    { sector: "Real Estate", percent: 4.3 },
  ],
};

type H = [ticker: string, company: string];
const bySector: Record<string, H[]> = {
  Technology: [["NVDA", "NVIDIA"], ["CRM", "Salesforce"], ["NET", "Cloudflare"], ["DDOG", "Datadog"], ["AMD", "Advanced Micro Devices"], ["MSFT", "Microsoft"], ["SNPS", "Synopsys"]],
  "Communication Services": [["DIS", "Walt Disney"], ["TMUS", "T-Mobile"], ["TTWO", "Take-Two Interactive"], ["VZ", "Verizon"], ["CMCSA", "Comcast"], ["META", "Meta Platforms"], ["GOOG", "Alphabet"], ["OMC", "Omnicom Group"]],
  "Consumer Goods": [["PG", "Procter & Gamble"], ["WMT", "Walmart"], ["CASY", "Casey’s General Stores"], ["ULTA", "Ulta Beauty"], ["AMZN", "Amazon"], ["COST", "Costco Wholesale"], ["GAP", "Gap"]],
  Energy: [["LNG", "Cheniere Energy"], ["SHEL", "Shell"], ["DINO", "HF Sinclair"], ["DVN", "Devon Energy"], ["HAL", "Halliburton"], ["ET", "Energy Transfer"], ["AESI", "Atlas Energy Solutions"]],
  Financials: [["AXP", "American Express"], ["JPM", "JPMorgan Chase"], ["APO", "Apollo Global Management"], ["V", "Visa"], ["CME", "CME Group"]],
  Healthcare: [["UNH", "UnitedHealth Group"], ["LLY", "Eli Lilly"], ["TMO", "Thermo Fisher Scientific"], ["BNTX", "BioNTech"], ["SYK", "Stryker"], ["AMGN", "Amgen"], ["ISRG", "Intuitive Surgical"]],
  Industrials: [["CAT", "Caterpillar"], ["RTX", "RTX"], ["WM", "Waste Management"], ["UFPI", "UFP Industries"], ["AME", "Ametek"], ["RSG", "Republic Services"]],
  "Natural Resources": [["EOG", "EOG Resources"], ["BHP", "BHP Group"], ["CF", "CF Industries"], ["TTE", "TotalEnergies"], ["MP", "MP Materials"], ["COP", "ConocoPhillips"], ["NEM", "Newmont"], ["CCJ", "Cameco"], ["WDS", "Woodside Energy Group"]],
  "Real Estate": [["INVH", "Invitation Homes"], ["ACM", "AECOM"], ["ARE", "Alexandria Real Estate Equities"], ["STAG", "STAG Industrial"], ["VICI", "VICI Properties"], ["O", "Realty Income"], ["PK", "Park Hotels & Resorts"]],
};

/** Featured on the Portfolio page (highlighted in the Fall 2026 letter), in display order. */
const featured: Record<string, string | undefined> = {
  NVDA: "≈ +4,052% since purchase: the fund’s largest gain",
  MSFT: "Triple-digit return since purchase",
  NET: "Triple-digit return since purchase",
  GOOG: "Core long-term holding: advertising, cloud and AI",
  META: "Core long-term holding: advertising and AI",
  LNG: "Exposure to growing U.S. LNG exports",
  DVN: "U.S. Lower 48 shale producer",
  WMT: "Resilient U.S. consumer franchise",
};
const featuredOrder = Object.keys(featured);

export const holdings: Holding[] = Object.entries(bySector).flatMap(([sector, list]) =>
  list.map(([ticker, company]) => ({
    id: ticker.toLowerCase(),
    company,
    ticker,
    sector,
    featured: ticker in featured,
    highlight: featured[ticker],
  })),
).sort((a, b) => {
  const fa = featuredOrder.indexOf(a.ticker), fb = featuredOrder.indexOf(b.ticker);
  return (fa < 0 ? 99 : fa) - (fb < 0 ? 99 : fb);
});

// ---------------------------------------------------------------------------
// Letters
// ---------------------------------------------------------------------------

export const letters: Letter[] = [
  {
    id: "letter-fall-2026",
    title: "Fall 2026 RUIF Letter",
    semester: "Fall 2026",
    publishedAt: "2026-09-01",
    summary:
      "The Rice Undergraduate Investment Fund is excited to introduce our Introductory Letter! The Board is excited to lead the Fund into another great semester.",
    url: "/letters/ruif-letter-fall-2026.pdf",
    filename: "RUIF-Letter-Fall-2026.pdf",
  },
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
