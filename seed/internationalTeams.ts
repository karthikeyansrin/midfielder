import { Team, Match } from "@/types/match";

export const WORLD_CUP_TEAMS: Team[] = [
  {
    id: "arg",
    name: "Argentina",
    shortName: "ARG",
    logoUrl: "",
    primaryColor: "#43A1D5", // Light blue
    secondaryColor: "#FFFFFF",
  },
  {
    id: "fra",
    name: "France",
    shortName: "FRA",
    logoUrl: "",
    primaryColor: "#002395", // Deep blue
    secondaryColor: "#ED2939",
  },
  {
    id: "bra",
    name: "Brazil",
    shortName: "BRA",
    logoUrl: "",
    primaryColor: "#009B3A", // Green
    secondaryColor: "#FEDF00",
  },
  {
    id: "eng",
    name: "England",
    shortName: "ENG",
    logoUrl: "",
    primaryColor: "#FFFFFF",
    secondaryColor: "#CE1126",
  },
  {
    id: "esp",
    name: "Spain",
    shortName: "ESP",
    logoUrl: "",
    primaryColor: "#AA151B", // Red
    secondaryColor: "#F1BF00",
  },
  {
    id: "bel",
    name: "Belgium",
    shortName: "BEL",
    logoUrl: "",
    primaryColor: "#E30613", // Red
    secondaryColor: "#000000",
  },
  {
    id: "ger",
    name: "Germany",
    shortName: "GER",
    logoUrl: "",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
  },
  {
    id: "por",
    name: "Portugal",
    shortName: "POR",
    logoUrl: "",
    primaryColor: "#FF0000", // Red
    secondaryColor: "#006600",
  },
];

export const WORLD_CUP_STADIUMS = [
  {
    id: "s_metlife",
    name: "MetLife Stadium",
    capacity: 82500,
    city: "New York/New Jersey",
    country: "USA",
  },
  {
    id: "s_sofi",
    name: "SoFi Stadium",
    capacity: 70240,
    city: "Los Angeles",
    country: "USA",
  },
  {
    id: "s_azteca",
    name: "Estadio Azteca",
    capacity: 83264,
    city: "Mexico City",
    country: "Mexico",
  },
  {
    id: "s_mercedes",
    name: "Mercedes-Benz Stadium",
    capacity: 71000,
    city: "Atlanta",
    country: "USA",
  },
  {
    id: "s_bc_place",
    name: "BC Place",
    capacity: 54500,
    city: "Vancouver",
    country: "Canada",
  },
] as const;

// Representative matches (seeded data for demonstration)
export const WORLD_CUP_MATCHES: Match[] = [
  {
    id: "wc_match_01",
    homeTeam: WORLD_CUP_TEAMS.find(t => t.id === "fra")!,
    awayTeam: WORLD_CUP_TEAMS.find(t => t.id === "bel")!,
    score: { home: 2, away: 1 },
    status: "live",
    kickoffTime: new Date(Date.now() - 52 * 60_000).toISOString(),
    venue: "MetLife Stadium",
    competition: "World Championship", // Generic name to avoid trademark issues while remaining realistic
    round: "Quarter Final",
    attendance: 82500,
    minute: 52,
    events: [],
  },
  {
    id: "wc_match_02",
    homeTeam: WORLD_CUP_TEAMS.find(t => t.id === "arg")!,
    awayTeam: WORLD_CUP_TEAMS.find(t => t.id === "bra")!,
    score: { home: 0, away: 0 },
    status: "scheduled",
    kickoffTime: new Date(Date.now() + 86400 * 1000).toISOString(),
    venue: "Estadio Azteca",
    competition: "World Championship",
    round: "Quarter Final",
    attendance: 83264,
    events: [],
  }
];
