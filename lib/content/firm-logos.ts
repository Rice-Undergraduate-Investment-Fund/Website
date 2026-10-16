import { normalizeFirm } from "./types";

/**
 * Logos for "Where RUIF members go" (home page). Files live in public/logos/firms
 * (sources: each firm's Wikipedia/Wikimedia logo or its own website, Oct 2026).
 * [firm name, file, width / height]. Firms without an entry show as text.
 * To add one: drop the file in public/logos/firms and add a row here.
 */
const LOGOS: [string, string, number][] = [
  ["Bain Capital", "/logos/firms/bain-capital.svg", 5.704],
  ["Bank of America", "/logos/firms/bank-of-america.svg", 9.17],
  ["Barclays", "/logos/firms/barclays.png", 5.921],
  ["BlackRock", "/logos/firms/blackrock.svg", 6.655],
  ["Blackstone", "/logos/firms/blackstone.svg", 2.517],
  ["Centerview Partners", "/logos/firms/centerview-partners.png", 6.571],
  ["Citadel", "/logos/firms/citadel.svg", 7.804],
  ["Citi", "/logos/firms/citi.svg", 1.73],
  ["Deutsche Bank", "/logos/firms/deutsche-bank.svg", 4.887],
  ["Evercore", "/logos/firms/evercore.svg", 6.038],
  ["Goldman Sachs", "/logos/firms/goldman-sachs.svg", 2.353],
  ["Guggenheim Securities", "/logos/firms/guggenheim-securities.svg", 11.977],
  ["J.P. Morgan", "/logos/firms/j-p-morgan.svg", 4.751],
  ["Lazard", "/logos/firms/lazard.svg", 5.009],
  ["Macquarie Group", "/logos/firms/macquarie-group.svg", 5.394],
  ["Mizuho", "/logos/firms/mizuho.svg", 3.287],
  ["Moelis & Company", "/logos/firms/moelis-and-company.png", 3.98],
  ["Morgan Stanley", "/logos/firms/morgan-stanley.svg", 6.577],
  ["Perella Weinberg Partners", "/logos/firms/perella-weinberg-partners.svg", 2.788],
  ["Piper Sandler", "/logos/firms/piper-sandler.png", 6.632],
  ["Point72", "/logos/firms/point72.png", 2.856],
  ["RBC Capital Markets", "/logos/firms/rbc-capital-markets.svg", 2.188],
  ["Sixth Street", "/logos/firms/sixth-street.svg", 3.5],
  ["TPH&Co.", "/logos/firms/tph-and-co.svg", 4.624],
  ["Vista Equity Partners", "/logos/firms/vista-equity-partners.svg", 4.622],
  ["Wells Fargo", "/logos/firms/wells-fargo.svg", 1.0],
];

/** Aliases: firms that share another firm's logo. */
const SAME_AS: Record<string, string> = {
  "Sixth Street Growth": "Sixth Street",
};

export type FirmLogo = { src: string; aspect: number };

const byKey = new Map(LOGOS.map(([name, src, aspect]) => [normalizeFirm(name), { src, aspect }]));

export function firmLogo(name: string): FirmLogo | undefined {
  return byKey.get(normalizeFirm(SAME_AS[name] ?? name));
}
