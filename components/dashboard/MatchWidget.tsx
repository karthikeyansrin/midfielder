"use client";

import { motion } from "framer-motion";
import { formatScore } from "@/lib/utils";
import type { Match } from "@/types/match";
import { useEventEngine } from "@/hooks/useEventEngine";
import { WORLD_CUP_MATCHES } from "@/seed/internationalTeams";

// Mock live match from seed
const MOCK_MATCH: Match = WORLD_CUP_MATCHES[0];

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
            <span className="text-[10px] font-bold text-[var(--accent-red)] uppercase tracking-wider">{match.minute}&apos;</span>
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
