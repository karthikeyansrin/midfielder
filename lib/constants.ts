// ─────────────────────────────────────────────
//  App-wide constants — MIDFIELDER platform
// ─────────────────────────────────────────────

export const APP_NAME = "MIDFIELDER" as const;
export const APP_DESCRIPTION =
  "The intelligent stadium fan engagement platform powered by AI.";
export const APP_VERSION = "0.1.0" as const;

// Navigation
export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Stats", href: "#stats" },
] as const;

export const DASHBOARD_NAV = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Profile", href: "/dashboard/profile", icon: "User" },
] as const;

export const ADMIN_NAV = [
  { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { label: "Stadium", href: "/admin/stadium", icon: "Building2" },
  { label: "Fans", href: "/admin/fans", icon: "Users" },
  { label: "Matches", href: "/admin/matches", icon: "Trophy" },
  { label: "Simulator", href: "/admin/simulator", icon: "Activity" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
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
  "North Stand",
  "South Stand",
  "East Stand",
  "West Stand",
  "VIP Lounge",
  "Press Box",
  "Family Zone",
] as const;

// Mock stadium details
export const STADIUM_INFO = {
  name: "MIDFIELDER Arena",
  capacity: 60000,
  city: "London",
  country: "England",
} as const;
