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

/**
 * Deterministically sets the expiration time based on priority.
 * 
 * CRITICAL: 2 min
 * HIGH: 5 min
 * MEDIUM: 15 min
 * LOW: 30 min
 * INFO: 60 min (default)
 */
export function getExpirationTime(priority: RecommendationPriority, currentTimeStr: string): string {
  const current = new Date(currentTimeStr);
  let minutesToAdd = 60; // Default for INFO

  switch (priority) {
    case "CRITICAL":
      minutesToAdd = 2;
      break;
    case "HIGH":
      minutesToAdd = 5;
      break;
    case "MEDIUM":
      minutesToAdd = 15;
      break;
    case "LOW":
      minutesToAdd = 30;
      break;
  }

  current.setMinutes(current.getMinutes() + minutesToAdd);
  return current.toISOString();
}
