// ─────────────────────────────────────────────
//  Match types — MIDFIELDER platform
// ─────────────────────────────────────────────

export type MatchStatus = "scheduled" | "live" | "half_time" | "completed" | "postponed" | "cancelled";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface MatchScore {
  home: number;
  away: number;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  type: "goal" | "yellow_card" | "red_card" | "substitution" | "penalty" | "own_goal";
  minute: number;
  playerId: string;
  playerName: string;
  teamId: string;
  description?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  score: MatchScore;
  status: MatchStatus;
  kickoffTime: string; // ISO
  venue: string;
  competition: string;
  round: string;
  attendance?: number;
  events: MatchEvent[];
  minute?: number; // current minute if live
}

export interface MatchPrediction {
  id: string;
  fanId: string;
  matchId: string;
  predictedScore: MatchScore;
  winner: "home" | "away" | "draw";
  pointsWon?: number;
  createdAt: string;
}
