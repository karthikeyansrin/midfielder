"use client";

import { useState } from "react";
import { useEventEngine } from "@/hooks/useEventEngine";
import { EventCard } from "./EventCard";
import { EventCategory } from "@/domain/events/StadiumEvent";
import { Activity, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORIES: { label: string; value: EventCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Security", value: "security" },
  { label: "Medical", value: "medical" },
  { label: "Crowd", value: "crowd_control" },
  { label: "Weather", value: "weather" },
  { label: "Operational", value: "operational" },
  { label: "Match", value: "match" },
  { label: "Marketing", value: "marketing" },
];

export function EventFeed({ onResolve }: { onResolve?: (id: string) => void }) {
  const { events } = useEventEngine();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");

  const filteredEvents = events
    .filter((e) => selectedCategory === "all" || e.category === selectedCategory)
    // Sort in reverse chronological order (newest first)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[var(--accent-blue)]" />
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Live Event Feed</h2>
          <Badge variant="outline" className="ml-2 bg-[var(--accent-blue-glow)] text-[var(--accent-blue)] border-[rgba(59,130,246,0.3)] animate-pulse">
            Live
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <Filter className="h-4 w-4 text-[var(--text-muted)] mr-2" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all border",
                selectedCategory === cat.value
                  ? "bg-[var(--text-primary)] text-[var(--bg-base)] border-[var(--text-primary)] shadow-md"
                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="rounded-xl border border-[var(--border-subtle)] border-dashed p-10 text-center text-[var(--text-muted)]">
            No events found for the selected category.
          </div>
        ) : (
          filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onResolve={onResolve} />
          ))
        )}
      </div>
    </div>
  );
}
