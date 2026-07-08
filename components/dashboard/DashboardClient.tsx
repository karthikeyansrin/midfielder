"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import { MatchWidget } from "@/components/dashboard/MatchWidget";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Progress } from "@/components/ui/progress";
import { FAN_TIERS } from "@/lib/constants";
import { useFanState } from "@/store/FanStateProvider";
import { MapPin, Navigation, Bell } from "lucide-react";

// Fallback stub in case context isn't ready
const STUB_FAN = {
  tier: "gold" as const,
  points: 2450,
  nextTierPoints: 5000,
};

export function DashboardClient() {
  const router = useRouter();
  const { fanContext, isHydrated } = useFanState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to onboarding if no context exists after hydration
  useEffect(() => {
    if (isHydrated && !fanContext) {
      router.push("/onboarding");
    }
  }, [isHydrated, fanContext, router]);

  if (!mounted || !isHydrated) return null; // Avoid hydration mismatch
  if (!fanContext) return null; // Will redirect

  const tierInfo = FAN_TIERS[STUB_FAN.tier];
  const progress = Math.round((STUB_FAN.points / STUB_FAN.nextTierPoints) * 100);

  // Determine accessibility badge if needed
  const hasAccessibilityNeeds = Object.values(fanContext.accessibility).some(Boolean);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome back, {fanContext.displayName} 👋
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {fanContext.matchInfo.stadiumId} ({fanContext.matchInfo.section})
            </span>
            <span className="text-[var(--border-strong)]">•</span>
            <span className="flex items-center gap-1">
              <Navigation className="h-4 w-4" />
              Arriving via {fanContext.travelProfile.modeOfTransport}
            </span>
            <span className="text-[var(--border-strong)]">•</span>
            <span className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              {fanContext.preferences.notificationPreference} Alerts
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasAccessibilityNeeds && (
            <div className="flex items-center gap-2 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[var(--accent-red-glow)] px-3 py-1.5">
              <span className="text-xs font-semibold text-[var(--accent-red)]">
                Assistance Requested
              </span>
            </div>
          )}
          {/* Tier badge */}
          <div
            className="flex items-center gap-2 rounded-xl border px-4 py-2"
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

      {/* Stats row */}
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
