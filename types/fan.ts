// ─────────────────────────────────────────────
//  Fan types — MIDFIELDER platform
// ─────────────────────────────────────────────

export type FanTier = "bronze" | "silver" | "gold" | "platinum" | "legend";

export interface FanProfile {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  favouriteTeam: string;
  favouritePlayers: string[];
  tier: FanTier;
  points: number;
  matchesAttended: number;
  joinedAt: string; // ISO date string
  preferences: FanPreferences;
}

export interface FanPreferences {
  notifications: boolean;
  language: string;
  seatingZone: string;
  dietaryRequirements: string[];
}

export interface FanStats {
  totalPoints: number;
  matchesAttended: number;
  rewardsRedeemed: number;
  currentStreak: number;
  allTimeRank: number;
  tier: FanTier;
  nextTierPoints: number;
}

export interface FanActivity {
  id: string;
  fanId: string;
  type: "check_in" | "reward" | "prediction" | "comment" | "achievement";
  title: string;
  description: string;
  pointsEarned?: number;
  timestamp: string;
}
