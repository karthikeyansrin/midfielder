// ─────────────────────────────────────────────
//  Stadium Event types — MIDFIELDER platform
// ─────────────────────────────────────────────

export type EventSeverity = "info" | "warning" | "critical" | "success";
export type EventCategory = "crowd" | "safety" | "operations" | "match" | "media" | "weather";

export interface StadiumZone {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  sector: "north" | "south" | "east" | "west" | "vip" | "press";
}

export interface StadiumEvent {
  id: string;
  type: string;
  category: EventCategory;
  severity: EventSeverity;
  title: string;
  description: string;
  zone?: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface StadiumSimulationConfig {
  matchId: string;
  scenarioType: "normal" | "crowd_surge" | "weather_delay" | "security_alert" | "power_outage";
  intensity: "low" | "medium" | "high";
  durationMinutes: number;
}

export interface StadiumSimulationResult {
  simulationId: string;
  config: StadiumSimulationConfig;
  events: StadiumEvent[];
  summary: string;
  startedAt: string;
  completedAt: string;
}

export interface StadiumMetrics {
  totalCapacity: number;
  currentOccupancy: number;
  occupancyPercentage: number;
  zones: StadiumZone[];
  activeAlerts: number;
  openGates: string[];
  weatherCondition: string;
  temperature: number;
}
