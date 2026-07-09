import { FanContext } from "../fan/FanContext";
import { StadiumEvent } from "../events/StadiumEvent";

export interface MatchStatus {
  state: "pre_match" | "in_progress" | "half_time" | "post_match";
  kickoffTime?: string;
  minutesPlayed?: number;
}

export interface StadiumState {
  currentCapacity?: number;
  openGates?: string[];
  weatherConditions?: string;
}

/**
 * DecisionContext is the single unified context object passed to the AI Decision Engine.
 * It contains everything Gemini needs to know to make a personalized recommendation.
 */
export interface DecisionContext {
  fan: FanContext;
  activeEvents: StadiumEvent[];
  currentTime: string; // ISO 8601
  matchStatus: MatchStatus;
  stadiumState: StadiumState;
}
