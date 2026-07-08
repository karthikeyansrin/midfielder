"use client";

import { motion } from "framer-motion";
import {
  Gift,
  LucideIcon,
  Minus,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { cn, formatCompact } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Gift,
  Star,
  Trophy,
  Zap,
};

interface StatCardProps {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  icon: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accent?: "amber" | "emerald" | "blue" | "red";
  compact?: boolean;
}

const ACCENT_CONFIG = {
  amber: {
    iconBg: "var(--accent-amber-glow)",
    iconBorder: "rgba(245,158,11,0.25)",
    iconColor: "var(--accent-amber)",
  },
  emerald: {
    iconBg: "var(--accent-emerald-glow)",
    iconBorder: "rgba(16,185,129,0.25)",
    iconColor: "var(--accent-emerald)",
  },
  blue: {
    iconBg: "var(--accent-blue-glow)",
    iconBorder: "rgba(59,130,246,0.25)",
    iconColor: "var(--accent-blue)",
  },
  red: {
    iconBg: "var(--accent-red-glow)",
    iconBorder: "rgba(239,68,68,0.25)",
    iconColor: "var(--accent-red)",
  },
};

export function StatCard({
  id,
  label,
  value,
  unit,
  icon,
  trend = "neutral",
  trendValue,
  accent = "amber",
  compact = false,
}: StatCardProps) {
  const config = ACCENT_CONFIG[accent];
  const Icon = ICON_MAP[icon] ?? Zap;
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-[var(--accent-emerald)]"
      : trend === "down"
        ? "text-[var(--accent-red)]"
        : "text-[var(--text-muted)]";

  const displayValue =
    typeof value === "number" && compact ? formatCompact(value) : String(value);

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35 }}
      className="card-stadium rounded-xl p-5 flex flex-col gap-3"
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            background: config.iconBg,
            border: `1px solid ${config.iconBorder}`,
          }}
        >
          <Icon className="h-4 w-4" style={{ color: config.iconColor }} />
        </div>
        {trendValue && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
            <TrendIcon className="h-3 w-3" />
            {trendValue}
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl font-bold text-[var(--text-primary)] leading-none">
          {displayValue}
          {unit && (
            <span className="ml-1 text-sm font-normal text-[var(--text-muted)]">
              {unit}
            </span>
          )}
        </p>
        <p className="mt-1.5 text-xs text-[var(--text-secondary)]">{label}</p>
      </div>
    </motion.div>
  );
}
