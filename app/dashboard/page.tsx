import type { Metadata } from "next";
import { StatCard } from "@/components/dashboard/StatCard";
import { MatchWidget } from "@/components/dashboard/MatchWidget";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Progress } from "@/components/ui/progress";
import { FAN_TIERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Fan Dashboard",
};

// Stub fan data — replace with auth-aware server-side fetch
const STUB_FAN = {
  displayName: "Alex Martinez",
  tier: "gold" as const,
  points: 2450,
  nextTierPoints: 5000,
};

export default function DashboardPage() {
  const tierInfo = FAN_TIERS[STUB_FAN.tier];
  const progress = Math.round((STUB_FAN.points / STUB_FAN.nextTierPoints) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome back, {STUB_FAN.displayName} 👋
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Tier badge — plain HTML, no LucideIcon reference */}
        <div
          className="hidden sm:flex items-center gap-2 rounded-xl border px-4 py-2"
          style={{
            borderColor: `${tierInfo.color}40`,
            background: `${tierInfo.color}10`,
          }}
        >
          <span className="text-sm font-semibold" style={{ color: tierInfo.color }}>
            ★ {tierInfo.label} Fan
          </span>
        </div>
      </div>

      {/* Tier progress bar */}
      <div
        id="dashboard-tier-progress"
        className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Points to Platinum
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {STUB_FAN.points.toLocaleString()} / {STUB_FAN.nextTierPoints.toLocaleString()} pts
            </p>
          </div>
          <p className="text-sm font-semibold text-[var(--accent-amber)]">{progress}%</p>
        </div>
        <Progress value={progress} className="h-2 bg-[var(--bg-elevated)]" />
      </div>

      {/* Stats row — icon names passed as strings, resolved inside StatCard (Client Component) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          id="stat-points"
          label="Loyalty Points"
          value={STUB_FAN.points}
          icon="Zap"
          accent="amber"
          trend="up"
          trendValue="+150"
          compact
        />
        <StatCard
          id="stat-matches"
          label="Matches Attended"
          value={34}
          icon="Trophy"
          accent="emerald"
          trend="up"
          trendValue="+1"
        />
        <StatCard
          id="stat-rewards"
          label="Rewards Redeemed"
          value={12}
          icon="Gift"
          accent="blue"
          trend="neutral"
        />
        <StatCard
          id="stat-streak"
          label="Current Streak"
          value={7}
          unit="matches"
          icon="Star"
          accent="amber"
          trend="up"
          trendValue="Personal best!"
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <ActivityFeed />
        <MatchWidget />
      </div>
    </div>
  );
}
