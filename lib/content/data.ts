/**
 * SEED / FALLBACK CONTENT
 *
 * Used (1) by `npm run seed` to fill an empty Sanity dataset, and (2) as a
 * fallback while the dataset is empty or unreachable. Anything marked
 * "placeholder" or `isSample: true` must be replaced with real content.
 * Real facts here come from the current financegroup.rice.edu site.
 */
import type {
  Alumnus,
  AlumniFirm,
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
    members: { value: "150+", label: "Fund Members" },
    sectors: { value: "11", label: "Sectors" },
    trainingStudents: { value: "200+", label: "Training Program Students" },
    alumni: { value: "500+", label: "Alumni Since 2017" },
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
        title: "Access to a Strong Alumni Network",
        description:
          "As a hub for finance on campus, RUIF connects members with an extensive network of alumni across the industry.",
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
      title: "Research",
      description:
        "Each sector conducts fundamental analysis on a company within its industry, developing an investment thesis and presentation.",
    },
    {
      title: "Pitch Day 1",
      description:
        "Members present stock ideas to the RUIF Board and investment professionals.",
    },
    {
      title: "Pitch Day 2",
      description:
        "Selected sectors present their stock analyses to a panel of Virani Business School professors and RUIF alumni working in the industry.",
    },
    {
      title: "Portfolio Decisions",
      description:
        "Stock recommendations undergo a final review by the Board and Portfolio Review team, with approved investments added to the portfolio.",
    },
  ],
  investmentProcess: [
    { title: "Research", description: "Sector teams build a thesis on a company." },
    { title: "Sector Discussion", description: "Ideas are debated within the sector." },
    { title: "Stock Pitch", description: "The strongest ideas are developed into a full pitch." },
    // 04–06 match "How We Operate" on the About page.
    { title: "Pitch Day 1", description: "Members present stock ideas to the RUIF Board and investment professionals." },
    {
      title: "Pitch Day 2",
      description:
        "Selected sectors present their stock analyses to a panel of Virani Business School professors and RUIF alumni working in the industry.",
    },
    {
      title: "Portfolio Decisions",
      description:
        "Stock recommendations undergo a final review by the Board and Portfolio Review team, with approved investments added to the portfolio.",
    },
  ],
  alumniEmployers: [
    "Morgan Stanley",
    "J.P. Morgan",
    "Bank of America",
    "Lazard",
    "Point72",
  ],
  contacts: [
    { label: "General Inquiries", email: "ricefinancegroup@gmail.com" },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/rice-undergraduate-investment-fund/",
      urlLabel: "Rice Undergraduate Investment Fund",
    },
    {
      label: "Rice New Energy Fund",
      url: "https://www.ricenewenergy.com",
      urlLabel: "ricenewenergy.com",
      email: "ricenewenergyfund@gmail.com",
    },
  ],
  address: "6100 Main St\nHouston, TX 77005",
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
    boardPosition: "President, Chief Investment Officer",
    boardOrder: 1,
    email: "sbk8@rice.edu",
    linkedin: "https://www.linkedin.com/in/sergiokaram/",
    bio: "What's up y'all! My name is Sergio Karam and I am originally from Houston, Texas. I am a senior at Wiess studying Finance with minors in Statistics and Entrepreneurship. This past summer I interned at Perella Weinberg in NYC. I am a huge car enthusiast and cyclist, and I also enjoy watching F1 and Star Wars and playing Clash Royale in my free time.",
  },
  {
    id: "tomas-hradil",
    name: "Tomas Hradil",
    status: "current",
    boardPosition: "Vice President, Chief Operating Officer",
    boardOrder: 2,
    email: "th68@rice.edu",
    linkedin: "https://www.linkedin.com/in/hradil/",
    bio: "Hey everyone! My name is Tomas Hradil, and I'm a senior at McMurtry College majoring in Mathematical Economics and Math. I'm originally from Prague, Czech Republic, and this past summer, I interned with Bank of America's Natural Resources Group here in Houston. Outside of school and work, I enjoy playing tennis and following soccer (COYS!). Apart from that, I also enjoy reading about history and politics. If you have any questions or just want to chat, don't hesitate to reach out!",
  },
  {
    id: "kenneth-manning",
    name: "Kenneth Manning",
    status: "current",
    boardPosition: "Senior Training Program Director",
    boardOrder: 3,
    email: "km108@rice.edu",
    linkedin: "https://www.linkedin.com/in/kennethmanning/",
    bio: "Hi y'all! My name is Kenny Manning, and I'm a senior at Rice University studying Finance with a minor in Entrepreneurship. This past summer, I interned at Wells Fargo in their Healthcare Investment Banking group in New York. Outside of school, I work on AI implementation and consulting projects, helping businesses use AI to improve their operations and automate workflows. In my free time, I enjoy working out, playing chess, exploring Houston, and spending time with friends. If you have any questions or just want to chat, don't hesitate to reach out!",
  },
  {
    id: "rahul-herrero",
    name: "Rahul Herrero",
    status: "current",
    boardPosition: "Senior Training Program Director",
    boardOrder: 4,
    email: "rh75@rice.edu",
    linkedin: "https://www.linkedin.com/in/rahul-herrero/",
    bio: "Hi everyone! My name is Rahul Herrero, and I'm a senior from Martel studying Statistics and Sport Analytics. This year, I will be returning to Deutsche Bank in San Francisco in the Technology coverage group, where I interned this summer, and I also have prior experience in sports data engineering. In my free time, I love playing soccer/watching Real Madrid, going to heavy metal concerts, finding obscure movies to review on Letterboxd, and hiking in National Parks. If you ever have any questions, feel free to reach out!",
  },
  {
    id: "sriram-chundi",
    name: "Sriram Chundi",
    status: "current",
    boardPosition: "Junior Training Program Director",
    boardOrder: 5,
    email: "sc303@rice.edu",
    linkedin: "https://www.linkedin.com/in/sriram314/",
    bio: "What's up everyone! I'm Sriram, a junior from Jones majoring in Mathematics and Religion. I was born in Michigan but moved to India at 9, where I finished grades 4–12. This coming summer, I'll be interning at Evercore in their Energy Coverage group in Houston. On campus, I'm involved with RUIF, the IB Bootcamp, and a couple other business organizations. In my free time, I love playing the guitar/Polyphia, collecting fragrances, and cooking. I'm always happy to help out so feel free to reach out!",
  },
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

// Headshots are NOT stored in the repo. Put them in seed-assets/people/<person-id>.jpg
// (git-ignored) and run `npm run seed:people`, or upload them directly in the Studio.

export const people: Person[] = [...board, ...sectorPeople, ...alumni];
export const sectors: Sector[] = sectorsRaw;

// ---------------------------------------------------------------------------
// Portfolio: from the Fall 2026 RUIF Letter (public/letters/ruif-letter-fall-2026.pdf)
// ---------------------------------------------------------------------------

export const portfolio: Portfolio = {
  aum: 70000, // letter: "approximately $70,000 currently under management"
  returnSinceInception: 1.305, // performance table, MAX: 130.5%
  inceptionYear: 2017,
  asOf: "August 2026", // figures: Fall 2026 letter; allocation: holdings report of Aug 26, 2026
  isSample: false,
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
  // Optional one-liner per card (e.g. "+4,052% since purchase"); left empty for now.
  NVDA: undefined,
  MSFT: undefined,
  NET: undefined,
  GOOG: undefined,
  META: undefined,
  LNG: undefined,
  DVN: undefined,
  WMT: undefined,
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
  applicationsOpen: false, // drives the Apply buttons (greyed out while closed)
  closedMessage: "Applications for the Spring 2027 Training Program will Open in Late Fall",
  closedHeadline: "Fall 2026 applications are closed.",
  closedNote: "Check back in December for Spring 2027 applications.",
  openDate: "Closed",
  deadline: "N/A",
  applyUrl: undefined, // application form link (add when applications open)
  isSample: false,
  steps: [
    { title: "Apply", description: "Submit a short application at the start of the semester." },
    { title: "Training Sessions", description: "Attend seven weekly sessions led by the Training Directors." },
    { title: "Complete Training", description: "Build core skills in accounting, valuation and markets." },
    { title: "Pitch Interview", description: "Present a stock pitch to demonstrate what you've learned." },
    { title: "Join a Sector", description: "Successful candidates are admitted into the fund and placed into a sector." },
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
  { year: "2019", title: "100+ Members", description: "Membership increases to 100+." },
  {
    year: "2021",
    title: "Rice New Energy Fund",
    description:
      "Rice New Energy Fund (RNEF) is launched, with a mandate to invest in energy transition projects and alternative energy sources.",
    linkText: "Rice New Energy Fund",
    linkUrl: "https://www.ricenewenergy.com/about-us",
  },
  { year: "2026", title: "Today", description: "150+ members across 11 sectors." },
];

/**
 * Focal points for page photos dropped into seed-assets/site/<photoKey>.jpg
 * (used by `npm run seed:about` / the settings seed). Editors can change them in the Studio.
 */
export const photoFocus: Record<string, string> = {
  homeHero: "50% 50%",
  trainingHero: "50% 40%",
  trainingCurriculum1: "30% 40%",
  trainingCurriculum2: "50% 60%",
  trainingCurriculum3: "50% 75%",
  aboutHero: "50% 50%",
  portfolioHero: "50% 40%",
  sectorsHero: "50% 48%",
  homeFeature: "50% 62%",
  boardGroup: "50% 62%",
  aboutMission: "35% 40%",
  aboutFund: "50% 35%",
  aboutHistory: "70% 40%",
};

/**
 * Firms shown in "Where RUIF members go" on the home page.
 * tier = row within the industry (1 = top). Rows are sorted A–Z automatically.
 */
export const alumniFirms: AlumniFirm[] = [
  // Investment Banking: bulge brackets
  ...["Bank of America", "Barclays", "Citi", "Deutsche Bank", "Goldman Sachs", "J.P. Morgan", "Mizuho", "Morgan Stanley", "Wells Fargo"]
    .map((name) => ({ name, industry: "ib" as const, tier: 1 })),
  // Investment Banking: elite boutiques
  ...["Centerview Partners", "Evercore", "Lazard", "Moelis & Company", "Perella Weinberg Partners"]
    .map((name) => ({ name, industry: "ib" as const, tier: 2 })),
  // Investment Banking: middle market / specialists
  ...["Guggenheim Securities", "Piper Sandler", "RBC Capital Markets", "TPH&Co."]
    .map((name) => ({ name, industry: "ib" as const, tier: 3 })),
  // Private Equity
  ...["Bain Capital", "BlackRock", "Blackstone", "Sixth Street", "Vista Equity Partners"]
    .map((name) => ({ name, industry: "pe" as const, tier: 1 })),
  // Hedge Funds & Trading
  ...["Citadel", "Macquarie Group", "Point72", "Sixth Street"].map((name) => ({ name, industry: "hf" as const, tier: 1 })),
];

/** Alt text (screen readers / search) for page photos in seed-assets/site/. */
export const photoAlt: Record<string, string> = {
  homeHero: "McNair Hall, home of Rice Business, at Rice University",
  trainingHero: "Two Training Program students at a session",
  trainingCurriculum1: "A Training Director helping a student during a Training Program session",
  trainingCurriculum2: "A Training Program session in progress",
  trainingCurriculum3: "Two students working through a Training Program exercise",
  aboutHero: "The skylit atrium of Virani Hall at Rice Business",
  portfolioHero: "Rice University campus at sunrise, with the Houston skyline in the distance",
  sectorsHero: "Rice University and the Houston skyline at night",
  aboutMission: "A RUIF general club meeting",
  aboutFund: "RUIF members at a general club meeting",
  aboutHistory: "RUIF members presenting at a general club meeting",
  homeFeature: "The 2026–27 RUIF Board",
  boardGroup: "The 2026–27 RUIF Board",
};

/** Sample entries for previewing the Alumni Directory locally (never used once Sanity is connected). */
export const sampleAlumni: Alumnus[] = [
  { id: "sample-alum-1", name: "Sample Alumnus 01", classYear: 2026, company: "Evercore", position: "Investment Banking Analyst", location: "Houston, TX", ruifRole: "Sector Director", ruifSector: "Energy", linkedin: "https://www.linkedin.com/" },
  { id: "sample-alum-2", name: "Sample Alumnus 02", classYear: 2026, company: "Goldman Sachs", position: "Investment Banking Analyst", location: "New York, NY", ruifRole: "Senior Analyst", ruifSector: "Technology", linkedin: "https://www.linkedin.com/" },
  { id: "sample-alum-3", name: "Sample Alumnus 03", classYear: 2026, company: "Citadel", position: "Investment Analyst", location: "Chicago, IL", ruifRole: "Vice President", linkedin: "https://www.linkedin.com/" },
  { id: "sample-alum-4", name: "Sample Alumnus 04", classYear: 2026, company: "Bain & Company", position: "Associate Consultant", location: "Houston, TX", ruifRole: "Junior Analyst", ruifSector: "Healthcare", linkedin: "https://www.linkedin.com/" },
  { id: "sample-alum-5", name: "Sample Alumnus 05", classYear: 2025, company: "J.P. Morgan", position: "Investment Banking Analyst", location: "San Francisco, CA", ruifRole: "President", linkedin: "https://www.linkedin.com/" },
  { id: "sample-alum-6", name: "Sample Alumnus 06", classYear: 2025, company: "Lazard", position: "Financial Advisory Analyst", location: "New York, NY", ruifRole: "Sector Director", ruifSector: "Financials", linkedin: "https://www.linkedin.com/" },
  { id: "sample-alum-7", name: "Sample Alumnus 07", classYear: 2025, company: "Blackstone", position: "Private Equity Analyst", location: "New York, NY", ruifRole: "Senior Analyst", ruifSector: "Real Estate", linkedin: "https://www.linkedin.com/" },
  { id: "sample-alum-8", name: "Sample Alumnus 08", classYear: 2025, company: "TPH&Co.", position: "Investment Banking Analyst", location: "Houston, TX", ruifRole: "Senior Analyst", ruifSector: "Energy", linkedin: "https://www.linkedin.com/" },
  { id: "sample-alum-9", name: "Sample Alumnus 09", classYear: 2024, company: "Point72", position: "Research Associate", location: "Stamford, CT", ruifRole: "Sector Director", ruifSector: "Consumer Goods", linkedin: "https://www.linkedin.com/" },
  { id: "sample-alum-10", name: "Sample Alumnus 10", classYear: 2024, company: "Morgan Stanley", position: "Associate", location: "New York, NY", ruifRole: "Senior Training Program Director", linkedin: "https://www.linkedin.com/" },
  { id: "sample-alum-11", name: "Sample Alumnus 11", classYear: 2024, company: "McKinsey & Company", position: "Business Analyst", location: "Dallas, TX", ruifRole: "Junior Analyst", ruifSector: "Industrials", linkedin: "https://www.linkedin.com/" },
  { id: "sample-alum-12", name: "Sample Alumnus 12", classYear: 2023, company: "Vista Equity Partners", position: "Associate", location: "Austin, TX", ruifRole: "Sector Director", ruifSector: "Technology", linkedin: "https://www.linkedin.com/" },
];
