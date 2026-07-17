"use client";

import { useRecommendationStore } from "@/store/recommendationStore";
import { formatRelativeTime } from "@/lib/utils";
import { motion } from "framer-motion";
import { History, CheckCircle2, XCircle, Clock } from "lucide-react";
import { RecommendationStatus } from "@/domain/recommendation/Recommendation";

const STATUS_ICONS: Record<RecommendationStatus, React.ElementType> = {
  ACTIVE: Clock,
  EXPIRED: Clock,
  DISMISSED: XCircle,
  COMPLETED: CheckCircle2,
};

const STATUS_COLORS: Record<RecommendationStatus, string> = {
  ACTIVE: "var(--accent-blue)",
  EXPIRED: "var(--text-muted)",
  DISMISSED: "var(--text-secondary)",
  COMPLETED: "var(--accent-emerald)",
};

export function RecommendationHistory() {
  const { recommendations } = useRecommendationStore();

  // Show only past recommendations (not active)
  const history = recommendations
    .filter((r) => r.status !== "ACTIVE")
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

  if (history.length === 0) return null;

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--border-subtle)]">
        <History className="h-4 w-4 text-[var(--text-muted)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">AI Recommendation History</h3>
      </div>
      
      <ul tabIndex={0} aria-label="Recommendation history" className="divide-y divide-[var(--border-subtle)] max-h-96 overflow-y-auto scrollbar-hide">
        {history.map((rec, i) => {
          const Icon = STATUS_ICONS[rec.status];
          const color = STATUS_COLORS[rec.status];

          return (
            <motion.li
              key={rec.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-4 px-5 py-4 hover:bg-[var(--bg-elevated)] transition-colors"
            >
              <div 
                className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${color}1a`, color }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {rec.title}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">
                  {rec.action}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--text-muted)] font-medium tracking-wider uppercase">
                  <span style={{ color }}>{rec.status}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(rec.generatedAt)}</span>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
