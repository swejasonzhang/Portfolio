/**
 * The five gates, in page order: Awakening → Projects → Abilities → Story →
 * the next gate. Index = depth; level = depth + 1. `color` is the gate's rank
 * accent: chips, the rail, the header readout and the favicon. The page itself
 * stays near-black, silver and ice blue.
 */
export const GATES = [
  { id: "home", gate: "00", label: "Home", chapter: "Awakening", color: "#6cbcff", rgb: "108, 188, 255", tone: "gate-blue" },
  { id: "projects", gate: "01", label: "Projects", chapter: "The S-Rank gate", rank: "S-Rank", color: "#ff4d64", rgb: "255, 77, 100", tone: "gate-red" },
  { id: "skills", gate: "02", label: "Skills", chapter: "Abilities", color: "#a184ff", rgb: "161, 132, 255", tone: "gate-violet" },
  { id: "about", gate: "03", label: "About", chapter: "The climb", color: "#c9d3e6", rgb: "201, 211, 230", tone: "gate-silver" },
  { id: "contact", gate: "04", label: "Contact", chapter: "The next gate", color: "#4fd8f2", rgb: "79, 216, 242", tone: "gate-cyan" },
] as const;

export type GateId = (typeof GATES)[number]["id"];
