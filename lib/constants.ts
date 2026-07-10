// ─────────────────────────────────────────────
//  App-wide constants — MIDFIELDER platform
// ─────────────────────────────────────────────
import { WORLD_CUP_STADIUMS } from "../seed/internationalTeams";

export const APP_NAME = "MIDFIELDER" as const;
export const APP_DESCRIPTION =
  "The intelligent stadium fan engagement platform powered by AI.";
export const APP_VERSION = "0.1.0" as const;

// Navigation
export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
] as const;

export const DASHBOARD_NAV = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Profile", href: "/dashboard/profile", icon: "User" },
] as const;

export const ADMIN_NAV = [
  { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { label: "Stadium", href: "/admin/stadium", icon: "Building2" },
] as const;

// Fan tiers
export const FAN_TIERS = {
  bronze: { label: "Bronze", color: "#cd7f32", minPoints: 0 },
  silver: { label: "Silver", color: "#c0c0c0", minPoints: 500 },
  gold: { label: "Gold", color: "#ffd700", minPoints: 1500 },
  platinum: { label: "Platinum", color: "#e5e4e2", minPoints: 5000 },
  legend: { label: "Legend", color: "#ff6b35", minPoints: 15000 },
} as const;

// API endpoints
export const API_ROUTES = {
  decide: "/api/decide",
  data: "/api/data",
  stadiumSimulate: "/api/stadium/simulate",
} as const;

// Default pagination
export const DEFAULT_PAGE_SIZE = 20;

// Stadium zones
export const STADIUM_ZONES = [
  "North Gate",
  "South Gate",
  "East Gate",
  "West Gate",
  "VIP Lounge",
  "Section 101",
  "Section 102",
  "Food Court A",
  "Merch Stand 1",
] as const;

// Mock stadiums for selection
export const STADIUMS = WORLD_CUP_STADIUMS;

// Legacy mock stadium details (can be removed later if unused)
export const STADIUM_INFO = STADIUMS[0];
