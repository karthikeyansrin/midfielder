"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Building2,
  Database,
  Gift,
  LayoutDashboard,
  LucideIcon,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { cn, formatCompact } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  BarChart3,
  Building2,
  Database,
  Gift,
  LayoutDashboard,
  Star,
  Trophy,
  Users,
  Zap,
};

interface MetricItem {
  id: string;
  label: string;
  value: number;
  unit?: string;
  icon: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  accent?: "amber" | "emerald" | "red" | "blue";
}

interface MetricsPanelProps {
  title: string;
  metrics: MetricItem[];
  columns?: 2 | 3 | 4;
}

const ACCENT_STYLES = {
  amber: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", color: "var(--accent-amber)" },
  emerald: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", color: "var(--accent-emerald)" },
  red: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", color: "var(--accent-red)" },
  blue: { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", color: "var(--accent-blue)" },
};

export function MetricsPanel({ title, metrics, columns = 4 }: MetricsPanelProps) {
  const gridClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <section id={`metrics-panel-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        {title}
      </h2>
      <div className={cn("grid gap-4", gridClass)}>
        {metrics.map((metric, i) => {
          const Icon = ICON_MAP[metric.icon] ?? Zap;
          const accent = ACCENT_STYLES[metric.accent ?? "amber"];
          return (
            <motion.div
              key={metric.id}
              id={metric.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 hover:border-[var(--border-default)] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: accent.bg, border: `1px solid ${accent.border}` }}
                >
                  <Icon className="h-4 w-4" style={{ color: accent.color }} />
                </div>
                {metric.change && (
                  <span
                    className={cn(
                      "text-[10px] font-semibold rounded-full px-2 py-0.5",
                      metric.changeType === "positive" && "text-[var(--accent-emerald)] bg-[var(--accent-emerald-glow)]",
                      metric.changeType === "negative" && "text-[var(--accent-red)] bg-[var(--accent-red-glow)]",
                      metric.changeType === "neutral" && "text-[var(--text-muted)] bg-[var(--bg-elevated)]"
                    )}
                  >
                    {metric.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {formatCompact(metric.value)}
                {metric.unit && (
                  <span className="ml-1 text-sm font-normal text-[var(--text-muted)]">{metric.unit}</span>
                )}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">{metric.label}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
