"use client";

import { Activity, CheckCircle, Database, Zap } from "lucide-react";
import type { SystemHealth } from "@/types/admin";

interface SystemHealthPanelProps {
  health: SystemHealth;
}

const STATUS_COLOR: Record<string, string> = {
  healthy: "var(--accent-emerald)",
  degraded: "var(--accent-amber)",
  down: "var(--accent-red)",
};

export function SystemHealthPanel({ health }: SystemHealthPanelProps) {
  const items = [
    {
      label: "API Latency",
      value: `${health.apiLatencyMs}ms`,
      Icon: Zap,
      status: "healthy",
    },
    {
      label: "Database",
      value: health.databaseStatus,
      Icon: Database,
      status: health.databaseStatus,
    },
    {
      label: "Firestore",
      value: health.firestoreStatus,
      Icon: Database,
      status: health.firestoreStatus,
    },
    {
      label: "Gemini AI",
      value: health.geminiStatus,
      Icon: Activity,
      status: health.geminiStatus,
    },
  ];

  return (
    <section id="admin-system-health">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-4 w-4 text-[var(--accent-emerald)]" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          System Health
        </h2>
        <span className="ml-auto text-[10px] text-[var(--text-muted)]">
          Last checked: {new Date(health.lastChecked).toLocaleTimeString()}
        </span>
      </div>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const color = STATUS_COLOR[item.status] ?? "var(--text-muted)";
          return (
            <div
              key={item.label}
              id={`system-health-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex items-center gap-3"
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                }}
              >
                <item.Icon className="h-4 w-4" style={{ color }} />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
                <p
                  className="text-sm font-semibold capitalize"
                  style={{ color }}
                >
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
