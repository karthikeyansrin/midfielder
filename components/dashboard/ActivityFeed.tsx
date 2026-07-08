"use client";

import { motion } from "framer-motion";
import { Clock, Gift, Star, Target, Zap } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import type { FanActivity } from "@/types/fan";

const ACTIVITY_ICONS: Record<FanActivity["type"], React.ElementType> = {
  check_in: Zap,
  reward: Gift,
  prediction: Target,
  comment: Star,
  achievement: Star,
};

const ACTIVITY_ACCENT: Record<FanActivity["type"], string> = {
  check_in: "var(--accent-amber)",
  reward: "var(--accent-emerald)",
  prediction: "var(--accent-blue)",
  comment: "var(--text-secondary)",
  achievement: "var(--accent-amber)",
};

// Mock activities — replace with useFanProfile() data
const MOCK_ACTIVITIES: FanActivity[] = [
  {
    id: "a1",
    fanId: "fan1",
    type: "check_in",
    title: "Matchday Check-In",
    description: "Checked in to MIDFIELDER Arena — North Stand",
    pointsEarned: 50,
    timestamp: new Date(Date.now() - 2 * 60_000).toISOString(),
  },
  {
    id: "a2",
    fanId: "fan1",
    type: "prediction",
    title: "Prediction Correct!",
    description: "Your 2-1 prediction for MIDFIELDER FC was spot on",
    pointsEarned: 150,
    timestamp: new Date(Date.now() - 45 * 60_000).toISOString(),
  },
  {
    id: "a3",
    fanId: "fan1",
    type: "achievement",
    title: "7-Match Streak",
    description: "You've attended 7 consecutive home matches",
    pointsEarned: 200,
    timestamp: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: "a4",
    fanId: "fan1",
    type: "reward",
    title: "Reward Redeemed",
    description: "Club scarf redeemed from the rewards store",
    timestamp: new Date(Date.now() - 24 * 3600_000).toISOString(),
  },
  {
    id: "a5",
    fanId: "fan1",
    type: "check_in",
    title: "Away Day Check-In",
    description: "Checked in for the away match at Wembley",
    pointsEarned: 75,
    timestamp: new Date(Date.now() - 3 * 24 * 3600_000).toISOString(),
  },
];

export function ActivityFeed() {
  return (
    <div
      id="activity-feed"
      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[var(--text-muted)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Activity</h3>
        </div>
        <button
          id="activity-feed-view-all"
          className="text-xs text-[var(--accent-amber)] hover:text-[var(--accent-amber-dim)] transition-colors"
        >
          View all →
        </button>
      </div>

      {/* Feed */}
      <ul className="divide-y divide-[var(--border-subtle)]">
        {MOCK_ACTIVITIES.map((activity, i) => {
          const Icon = ACTIVITY_ICONS[activity.type];
          const color = ACTIVITY_ACCENT[activity.type];

          return (
            <motion.li
              key={activity.id}
              id={`activity-item-${activity.id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-3 px-5 py-3.5 hover:bg-[var(--bg-elevated)] transition-colors"
            >
              {/* Icon */}
              <div
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `${color}1a`, border: `1px solid ${color}33` }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                  {activity.description}
                </p>
              </div>

              {/* Right side */}
              <div className="shrink-0 text-right">
                {activity.pointsEarned && (
                  <p className="text-xs font-semibold text-[var(--accent-emerald)]">
                    +{activity.pointsEarned} pts
                  </p>
                )}
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
