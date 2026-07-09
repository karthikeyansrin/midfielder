import { useEventEngine } from "@/hooks/useEventEngine";
import { AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function OperationsSummary() {
  const { events } = useEventEngine();

  const activeEvents = events.filter((e) => e.status === "active" || e.status === "investigating");
  const resolvedEvents = events.filter((e) => e.status === "resolved");

  // Calculate Risk Level
  let riskLevel = "Low";
  let riskColor = "text-emerald-500";
  let riskBg = "bg-emerald-500/10 border-emerald-500/20";
  let riskIndicator = "bg-emerald-500";

  const hasCritical = activeEvents.some((e) => e.severity === "critical");
  const hasHigh = activeEvents.some((e) => e.severity === "high");
  const hasMedium = activeEvents.some((e) => e.severity === "medium");

  if (hasCritical) {
    riskLevel = "Critical";
    riskColor = "text-[var(--accent-red)]";
    riskBg = "bg-[var(--accent-red-glow)] border-[rgba(239,68,68,0.3)]";
    riskIndicator = "bg-[var(--accent-red)] animate-pulse";
  } else if (hasHigh) {
    riskLevel = "Elevated";
    riskColor = "text-orange-500";
    riskBg = "bg-orange-500/10 border-orange-500/20";
    riskIndicator = "bg-orange-500";
  } else if (hasMedium) {
    riskLevel = "Medium";
    riskColor = "text-[var(--accent-amber)]";
    riskBg = "bg-[var(--accent-amber-glow)] border-[rgba(245,158,11,0.3)]";
    riskIndicator = "bg-[var(--accent-amber)]";
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Active Events */}
      <div className="flex items-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent-blue-glow)] text-[var(--accent-blue)]">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-muted)]">Active Events</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{activeEvents.length}</p>
        </div>
      </div>

      {/* Risk Level */}
      <div className={cn("flex items-center gap-4 rounded-xl border p-5 transition-colors", riskBg)}>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--bg-base)]">
          <AlertTriangle className={cn("h-6 w-6", riskColor)} />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-muted)]">Current Risk Level</p>
          <div className="flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full", riskIndicator)} />
            <p className={cn("text-2xl font-bold", riskColor)}>{riskLevel}</p>
          </div>
        </div>
      </div>

      {/* Resolved Events */}
      <div className="flex items-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent-emerald-glow)] text-[var(--accent-emerald)]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-muted)]">Resolved Today</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{resolvedEvents.length}</p>
        </div>
      </div>
    </div>
  );
}
