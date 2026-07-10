import { EventCategory } from "@/domain/events/StadiumEvent";
import { cn } from "@/lib/utils";
import { ShieldAlert, Stethoscope, Wrench, Users, CloudRain, Settings, Trophy, Tag } from "lucide-react";

const categoryConfig: Record<EventCategory, { icon: React.ElementType; color: string; label: string }> = {
  security: { icon: ShieldAlert, color: "text-red-500", label: "Security" },
  medical: { icon: Stethoscope, color: "text-pink-500", label: "Medical" },
  maintenance: { icon: Wrench, color: "text-blue-500", label: "Maintenance" },
  crowd_control: { icon: Users, color: "text-amber-500", label: "Crowd Control" },
  weather: { icon: CloudRain, color: "text-cyan-500", label: "Weather" },
  operational: { icon: Settings, color: "text-purple-500", label: "Operational" },
  match: { icon: Trophy, color: "text-emerald-500", label: "Match" },
  marketing: { icon: Tag, color: "text-yellow-500", label: "Marketing" },
};

export function CategoryBadge({ category }: { category: EventCategory }) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-elevated)]", config.color)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </div>
  );
}
