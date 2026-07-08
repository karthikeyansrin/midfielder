"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatScore } from "@/lib/utils";
import type { Match } from "@/types/match";

// Mock live match — replace with Firestore subscription
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
  events: [
    {
      id: "e1", matchId: "match_live_01", type: "goal",
      minute: 12, playerId: "p1", playerName: "J. Martinez",
      teamId: "mfc", description: "Right foot, low shot",
    },
    {
      id: "e2", matchId: "match_live_01", type: "goal",
      minute: 35, playerId: "p2", playerName: "R. Thompson",
      teamId: "afc", description: "Header from corner",
    },
    {
      id: "e3", matchId: "match_live_01", type: "goal",
      minute: 48, playerId: "p3", playerName: "L. Santos",
      teamId: "mfc", description: "Penalty kick",
    },
  ],
};

export function MatchWidget() {
  const match = MOCK_MATCH;
  const isLive = match.status === "live";

  return (
    <motion.div
      id="match-widget"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden"
      style={isLive ? { borderColor: "rgba(245,158,11,0.3)", boxShadow: "var(--shadow-amber)" } : {}}
    >
      {/* Match header */}
      <div className="px-5 py-3 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            {match.competition}
          </p>
          <p className="text-xs text-[var(--text-muted)]">{match.round}</p>
        </div>
        {isLive ? (
          <div className="flex items-center gap-2 rounded-full border border-[rgba(239,68,68,0.3)] bg-[var(--accent-red-glow)] px-3 py-1">
            <span className="live-dot" style={{ background: "var(--accent-red)", boxShadow: "0 0 6px var(--accent-red)" }} />
            <span className="text-xs font-bold text-[var(--accent-red)] tracking-wide">LIVE {match.minute}&apos;</span>
          </div>
        ) : (
          <Badge variant="secondary" className="text-[10px]">{match.status}</Badge>
        )}
      </div>

      {/* Score section */}
      <div className="px-5 py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Home team */}
          <div className="flex-1 text-center">
            <div
              className="mx-auto mb-2 h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ background: `${match.homeTeam.primaryColor}20`, border: `2px solid ${match.homeTeam.primaryColor}40` }}
            >
              {match.homeTeam.shortName.slice(0, 1)}
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {match.homeTeam.name}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Home</p>
          </div>

          {/* Score */}
          <div className="text-center shrink-0">
            <p className="font-display text-5xl font-bold text-[var(--text-primary)]">
              {formatScore(match.score.home, match.score.away)}
            </p>
            <p className="mt-1 text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              {isLive ? `${match.minute}'` : match.status}
            </p>
          </div>

          {/* Away team */}
          <div className="flex-1 text-center">
            <div
              className="mx-auto mb-2 h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ background: `${match.awayTeam.primaryColor}20`, border: `2px solid ${match.awayTeam.primaryColor}40` }}
            >
              {match.awayTeam.shortName.slice(0, 1)}
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {match.awayTeam.name}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Away</p>
          </div>
        </div>

        {/* Match info */}
        <div className="mt-5 flex items-center justify-center gap-4 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {match.venue}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {match.attendance?.toLocaleString()} fans
          </span>
        </div>
      </div>

      {/* Goals timeline */}
      {match.events.filter((e) => e.type === "goal").length > 0 && (
        <div className="px-5 pb-4 border-t border-[var(--border-subtle)]">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2 pt-3">Goals</p>
          <ul className="space-y-1">
            {match.events
              .filter((e) => e.type === "goal")
              .map((event) => {
                const isHome = event.teamId === match.homeTeam.id;
                return (
                  <li
                    key={event.id}
                    className={`flex items-center gap-2 text-xs ${isHome ? "" : "flex-row-reverse"}`}
                  >
                    <span className="text-[var(--text-muted)]">{event.minute}&apos;</span>
                    <span className="text-[var(--accent-amber)]">⚽</span>
                    <span className="text-[var(--text-secondary)] font-medium">{event.playerName}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-5 pb-5 pt-3 flex gap-2">
        <button
          id="match-widget-predict"
          className="flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-2 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--accent-amber-border)] hover:text-[var(--accent-amber)] transition-colors flex items-center justify-center gap-1"
        >
          <Clock className="h-3 w-3" />
          Predict
        </button>
        <button
          id="match-widget-stats"
          className="flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-2 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:text-[var(--text-primary)] transition-colors"
        >
          Full Stats
        </button>
      </div>
    </motion.div>
  );
}
