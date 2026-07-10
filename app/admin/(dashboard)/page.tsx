import type { Metadata } from "next";
import { MetricsPanel } from "@/components/admin/MetricsPanel";
import { SystemHealthPanel } from "@/components/admin/SystemHealthPanel";
import { MissionControl } from "@/components/operations/MissionControl";
import type { SystemHealth } from "@/types/admin";
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

// Stub system health — replace with real health check service
const SYSTEM_HEALTH: SystemHealth = {
  apiLatencyMs: 42,
  databaseStatus: "healthy",
  firestoreStatus: "healthy",
  geminiStatus: "healthy",
  uptimePercent: 99.97,
  lastChecked: new Date().toISOString(),
};

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Platform Overview
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Stadium management · Fan analytics · Event simulation
          </p>
        </div>

        {/* System health pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[rgba(16,185,129,0.3)] bg-[var(--accent-emerald-glow)] px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-[var(--accent-emerald)]" />
          <span className="text-sm font-semibold text-[var(--accent-emerald)]">
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Transparency Badge */}
      <div className="bg-[var(--accent-blue-glow)] border border-[rgba(59,130,246,0.3)] rounded-lg p-3 flex items-start gap-3">
        <Info className="w-5 h-5 text-[var(--accent-blue)] shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider mb-1">Simulation Environment</p>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Match and venue information is based on FIFA World Cup 2026 fixtures. Stadium operational events are simulated to demonstrate AI decision-making.
          </p>
        </div>
      </div>

      {/* Platform metrics — icons passed as strings, resolved in Client Component */}
      <MetricsPanel
        title="Platform Metrics"
        metrics={[
          {
            id: "admin-metric-total-fans",
            label: "Total Registered Fans",
            value: 2_400_000,
            icon: "Users",
            accent: "amber",
            change: "+12.4% ↑",
            changeType: "positive",
          },
          {
            id: "admin-metric-active-today",
            label: "Active Fans Today",
            value: 47_320,
            icon: "Activity",
            accent: "emerald",
            change: "+8.1% ↑",
            changeType: "positive",
          },
          {
            id: "admin-metric-total-matches",
            label: "Total Matches",
            value: 1_250,
            icon: "Zap",
            accent: "blue",
            change: "+5 this week",
            changeType: "positive",
          },
          {
            id: "admin-metric-retention",
            label: "Retention Rate",
            value: 84,
            unit: "%",
            icon: "BarChart3",
            accent: "amber",
            change: "-0.3% ↓",
            changeType: "negative",
          },
        ]}
        columns={4}
      />

      {/* System health — rendered in a Client Component */}
      <SystemHealthPanel health={SYSTEM_HEALTH} />

      {/* Main content — Mission Control */}
      <div className="mt-8">
        <MissionControl />
      </div>
    </div>
  );
}
