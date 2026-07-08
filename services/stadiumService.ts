// ─────────────────────────────────────────────
//  Stadium Simulation Service — MIDFIELDER platform
//  Generates mock stadium events for testing / demos.
// ─────────────────────────────────────────────

import { generateId } from "@/lib/utils";
import type {
  StadiumEvent,
  StadiumMetrics,
  StadiumSimulationConfig,
  StadiumSimulationResult,
  EventCategory,
  EventSeverity,
} from "@/types/event";

// ── Scenario event templates ─────────────────────────────────────

const SCENARIO_TEMPLATES: Record<
  StadiumSimulationConfig["scenarioType"],
  Array<{
    type: string;
    category: EventCategory;
    severity: EventSeverity;
    title: string;
    description: string;
  }>
> = {
  normal: [
    {
      type: "gate_open",
      category: "operations",
      severity: "info",
      title: "Gates Open",
      description: "All main gates are now open for entry.",
    },
    {
      type: "concession_busy",
      category: "operations",
      severity: "info",
      title: "High Concession Activity",
      description: "Concession stands reporting high traffic. Extra staff deployed.",
    },
  ],
  crowd_surge: [
    {
      type: "crowd_surge",
      category: "crowd",
      severity: "warning",
      title: "Crowd Surge Detected",
      description: "Unusual crowd density in North Stand sector.",
    },
    {
      type: "steward_alert",
      category: "safety",
      severity: "critical",
      title: "Steward Alert",
      description: "Additional stewards deployed to North Stand. Monitoring ongoing.",
    },
  ],
  weather_delay: [
    {
      type: "weather_warning",
      category: "weather",
      severity: "warning",
      title: "Weather Warning Issued",
      description: "Thunderstorm approaching. Match delay possible.",
    },
    {
      type: "match_delay",
      category: "match",
      severity: "critical",
      title: "Match Temporarily Delayed",
      description: "Lightning within 8 miles. Players returning to dressing rooms.",
    },
  ],
  security_alert: [
    {
      type: "security_incident",
      category: "safety",
      severity: "critical",
      title: "Security Incident Reported",
      description: "Unverified security concern at Gate 7. Security team responding.",
    },
  ],
  power_outage: [
    {
      type: "power_outage",
      category: "operations",
      severity: "critical",
      title: "Partial Power Outage",
      description: "East Stand floodlights offline. Engineering team notified.",
    },
    {
      type: "generator_active",
      category: "operations",
      severity: "warning",
      title: "Backup Generator Active",
      description: "Generator powering essential systems. Estimated resolution: 15 minutes.",
    },
  ],
};

// ── Simulation runner ────────────────────────────────────────────

/**
 * Simulate stadium events for a given configuration.
 * TODO: Replace with real sensor data / ML model predictions
 */
export async function runStadiumSimulation(
  config: StadiumSimulationConfig
): Promise<StadiumSimulationResult> {
  const startedAt = new Date().toISOString();
  const templates = SCENARIO_TEMPLATES[config.scenarioType] ?? SCENARIO_TEMPLATES.normal;

  const events: StadiumEvent[] = templates.map((template, i) => ({
    id: generateId("evt"),
    matchId: config.matchId,
    resolved: false,
    timestamp: new Date(Date.now() + i * 60_000).toISOString(),
    ...template,
  }));

  return {
    simulationId: generateId("sim"),
    config,
    events,
    summary: `Simulated ${events.length} events for scenario: ${config.scenarioType}`,
    startedAt,
    completedAt: new Date().toISOString(),
  };
}

// ── Metrics stub ──────────────────────────────────────────────────

/**
 * Get current stadium metrics.
 * TODO: Fetch from real-time Firestore or IoT sensor streams
 */
export async function getStadiumMetrics(): Promise<StadiumMetrics> {
  return {
    totalCapacity: 60_000,
    currentOccupancy: 47_320,
    occupancyPercentage: 78.9,
    zones: [
      { id: "north", name: "North Stand", capacity: 15000, currentOccupancy: 13800, sector: "north" },
      { id: "south", name: "South Stand", capacity: 15000, currentOccupancy: 12200, sector: "south" },
      { id: "east", name: "East Stand", capacity: 12000, currentOccupancy: 9800, sector: "east" },
      { id: "west", name: "West Stand", capacity: 12000, currentOccupancy: 10120, sector: "west" },
      { id: "vip", name: "VIP Lounge", capacity: 3000, currentOccupancy: 1200, sector: "vip" },
      { id: "press", name: "Press Box", capacity: 3000, currentOccupancy: 200, sector: "press" },
    ],
    activeAlerts: 0,
    openGates: ["Gate 1", "Gate 2", "Gate 3", "Gate 4", "VIP Entrance"],
    weatherCondition: "Clear",
    temperature: 18,
  };
}
