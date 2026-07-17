import { RecommendationPriority } from "@/domain/recommendation/Recommendation";
import { StadiumEvent } from "@/domain/events/StadiumEvent";

/**
 * Calculates priority deterministically based on severity and urgency.
 */
export function calculatePriority(events: StadiumEvent[]): RecommendationPriority {
  if (events.some(e => e.severity === "critical")) return "CRITICAL";
  if (events.some(e => e.severity === "high")) return "HIGH";
  if (events.some(e => e.severity === "medium")) return "MEDIUM";
  if (events.some(e => e.severity === "low")) return "LOW";
  return "INFO";
}

export const EXPIRATION_MINUTES: Record<RecommendationPriority, number> = {
  CRITICAL: 2,
  HIGH: 5,
  MEDIUM: 15,
  LOW: 30,
  INFO: 60,
};

/**
 * Deterministically sets the expiration time based on priority.
 */
export function getExpirationTime(priority: RecommendationPriority, currentTimeStr: string): string {
  const current = new Date(currentTimeStr);
  const minutesToAdd = EXPIRATION_MINUTES[priority] || EXPIRATION_MINUTES.INFO;

  current.setMinutes(current.getMinutes() + minutesToAdd);
  return current.toISOString();
}
