import { EventSeverity } from "@/domain/events/StadiumEvent";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SeverityBadge({ severity }: { severity: EventSeverity }) {
  const styles: Record<EventSeverity, string> = {
    low: "border-[rgba(59,130,246,0.3)] bg-[var(--accent-blue-glow)] text-[var(--accent-blue)]",
    medium: "border-[rgba(245,158,11,0.3)] bg-[var(--accent-amber-glow)] text-[var(--accent-amber)]",
    high: "border-[rgba(249,115,22,0.3)] bg-[rgba(249,115,22,0.1)] text-orange-500",
    critical: "border-[rgba(239,68,68,0.3)] bg-[var(--accent-red-glow)] text-[var(--accent-red)]",
  };

  return (
    <Badge variant="outline" className={cn("capitalize font-semibold", styles[severity])}>
      {severity}
    </Badge>
  );
}
