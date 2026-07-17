import { FanContext } from "@/domain/fan/FanContext";
import { StadiumEvent } from "@/domain/events/StadiumEvent";

/**
 * Determines which active stadium events are relevant to the fan.
 * 
 * Responsibility: Filters out events that don't apply to the user to reduce AI token usage and improve recommendation accuracy. It evaluates spatial relevance, transport modes, and event severities.
 * 
 * Inputs:
 * - fan: FanContext (The fan's profile, including section and transport mode)
 * - activeEvents: StadiumEvent[] (All currently active events in the stadium)
 * 
 * Outputs:
 * - StadiumEvent[] (A filtered subset of events that directly affect this fan)
 */
export function getRelevantEvents(
  fan: FanContext,
  activeEvents: StadiumEvent[]
): StadiumEvent[] {
  // A simplistic filter for now. In a real system, this would evaluate spatial
  // relevance (e.g. is the event near the fan's section, parking lot, or gate?)
  // For now, we assume all high/critical events are relevant, and others are conditionally relevant.
  return activeEvents.filter(event => {
    if (event.severity === "critical" || event.severity === "high") {
      return true; // Always relevant
    }

    // Example logic: if event is transport-related, check fan's transport mode
    if (event.category === "operational" && event.title.toLowerCase().includes("metro")) {
      return fan.travelProfile.modeOfTransport === "Metro";
    }

    // Example logic: affected zones overlap with fan's section
    if (event.affectedZones && event.affectedZones.length > 0) {
      // Check if fan section is in affected zones (case-insensitive)
      const sectionLower = fan.matchInfo.section.toLowerCase();
      if (event.affectedZones.some(zone => zone.toLowerCase() === sectionLower || zone.toLowerCase() === "all")) {
        return true;
      }
    }

    // Default include for demonstration, but typically we'd be more restrictive
    return true;
  });
}
