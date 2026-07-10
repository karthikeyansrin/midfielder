"use client";

import { motion } from "framer-motion";
import { formatScore } from "@/lib/utils";
import type { Match } from "@/types/match";
import { useEventEngine } from "@/hooks/useEventEngine";

// Mock live match
const MOCK_MATCH: Match = {
  id: "match_live_01",
  homeTeam: {
    id: "mfc",
    name: "MIDFIELDER FC",
    shortName: "MFC",
    logoUrl: "",
    primaryColor: "#f59e0b",
    secondaryColor: "#0d1117",
  },
  awayTeam: {
    id: "afc",
    name: "Arena Athletic",
    shortName: "AAF",
    logoUrl: "",
    primaryColor: "#10b981",
    secondaryColor: "#0d1117",
  },
  score: { home: 2, away: 1 },
  status: "live",
  kickoffTime: new Date(Date.now() - 52 * 60_000).toISOString(),
  venue: "MIDFIELDER Arena",
  competition: "Premier League",
  round: "Matchweek 28",
  attendance: 47320,
  minute: 52,
  events: [],
};

export function MatchWidget() {
  const match = MOCK_MATCH;
  const { matchStatus } = useEventEngine();
  const isLive = matchStatus === "first_half" || matchStatus === "second_half" || matchStatus === "kickoff";
  
  const displayStatus = matchStatus.replace("_", " ");

  return (
    <motion.div
      id="match-widget"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2"
    >
      <div className="flex items-center gap-3">
        {isLive ? (
          <div className="flex items-center gap-1.5 rounded bg-[var(--accent-red-glow)] px-1.5 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-red)] animate-pulse shadow-[0_0_4px_var(--accent-red)]" />
            <span className="text-[10px] font-bold text-[var(--accent-red)] uppercase tracking-wider">{match.minute}'</span>
          </div>
        ) : (
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{displayStatus}</span>
        )}
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <span className="opacity-80">{match.homeTeam.shortName}</span>
          <span className="font-display tabular-nums tracking-widest">{formatScore(match.score.home, match.score.away)}</span>
          <span className="opacity-80">{match.awayTeam.shortName}</span>
        </div>
      </div>
      <div className="hidden sm:block text-xs text-[var(--text-muted)]">
        {match.competition} • {match.venue}
      </div>
    </motion.div>
  );
}
