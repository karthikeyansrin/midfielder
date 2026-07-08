"use client";

// ─────────────────────────────────────────────
//  useStadiumEvents hook — MIDFIELDER platform
//  Polls the stadium simulator API for live events.
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import type { StadiumEvent, StadiumMetrics } from "@/types/event";

interface UseStadiumEventsReturn {
  events: StadiumEvent[];
  metrics: StadiumMetrics | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook for subscribing to live stadium events and metrics.
 * TODO: Replace polling with Firestore onSnapshot listener for real-time updates.
 *
 * @param pollIntervalMs - How often to refresh events (default: 30s)
 */
export function useStadiumEvents(pollIntervalMs = 30_000): UseStadiumEventsReturn {
  const [events, setEvents] = useState<StadiumEvent[]>([]);
  const [metrics, setMetrics] = useState<StadiumMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace with real API call or Firestore listener
      // const res = await fetch("/api/stadium/events");
      // const data = await res.json();
      // setEvents(data.events);
      // setMetrics(data.metrics);
      setEvents([]); // stub
      setMetrics(null); // stub
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stadium events");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEvents();
    const interval = setInterval(() => void fetchEvents(), pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchEvents, pollIntervalMs]);

  return { events, metrics, isLoading, error, refresh: fetchEvents };
}
