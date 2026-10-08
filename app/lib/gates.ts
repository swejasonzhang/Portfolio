/** The six gates, in page order. Index = depth; level = depth + 1. */
export const GATES = [
  { id: "awakening", gate: "00", label: "Awakening", color: "#58a6ff", rgb: "88, 166, 255" },
  { id: "inkmity", gate: "01", label: "Inkmity", rank: "S-Rank", color: "#ff4d64", rgb: "255, 77, 100" },
  { id: "works", gate: "02", label: "Cleared gates", color: "#3ddc97", rgb: "61, 220, 151" },
  { id: "record", gate: "03", label: "Quest log", color: "#f5b942", rgb: "245, 185, 66" },
  { id: "self", gate: "04", label: "Titles", color: "#a06bff", rgb: "160, 107, 255" },
  { id: "contact", gate: "05", label: "Message", color: "#38d6f5", rgb: "56, 214, 245" },
] as const;
