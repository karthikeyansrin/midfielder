"use client";

import { useEventEngine } from "@/hooks/useEventEngine";
import { EventFeed } from "@/components/events/EventFeed";

export function EventTimeline() {
  const { resolveEvent } = useEventEngine();

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
      <EventFeed onResolve={resolveEvent} />
    </div>
  );
}
