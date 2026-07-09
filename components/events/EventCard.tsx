import { StadiumEvent } from "@/domain/events/StadiumEvent";
import { SeverityBadge } from "./SeverityBadge";
import { CategoryBadge } from "./CategoryBadge";
import { formatRelativeTime } from "@/lib/utils";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";

export function EventCard({ 
  event, 
  onResolve,
  isAffected 
}: { 
  event: StadiumEvent;
  onResolve?: (id: string) => void;
  isAffected?: boolean;
}) {
  const isResolved = event.status === "resolved";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-5 transition-all ${
        isResolved 
          ? "border-[var(--border-subtle)] bg-[var(--bg-surface)] opacity-70" 
          : isAffected
          ? "border-[var(--accent-amber)] bg-[var(--accent-amber-glow)] shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-[var(--accent-amber)] animate-pulse"
          : "border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={event.severity} />
            <CategoryBadge category={event.category} />
            {isResolved && (
              <span className="text-xs font-semibold text-[var(--accent-emerald)] bg-[var(--accent-emerald-glow)] px-2 py-0.5 rounded-full border border-[rgba(16,185,129,0.3)]">
                Resolved
              </span>
            )}
          </div>
          
          <div>
            <h4 className={`text-base font-semibold ${isResolved ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)]"}`}>
              {event.title}
            </h4>
            <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)] pt-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{event.location.description || event.affectedZones.join(", ")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatRelativeTime(event.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Resolve Action */}
        {!isResolved && onResolve && (
          <button
            onClick={() => onResolve(event.id)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-muted)] hover:border-[var(--accent-emerald)] hover:bg-[var(--accent-emerald-glow)] hover:text-[var(--accent-emerald)] transition-all"
            title="Mark as Resolved"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}
