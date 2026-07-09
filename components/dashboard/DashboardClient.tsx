"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import { MatchWidget } from "@/components/dashboard/MatchWidget";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Progress } from "@/components/ui/progress";
import { FAN_TIERS } from "@/lib/constants";
import { useFanState } from "@/store/FanStateProvider";
import { NextBestAction } from "@/components/dashboard/NextBestAction";
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
      {/* Next Best Action Hero Area */}
      <NextBestAction />

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
