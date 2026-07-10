import { FanContext } from "@/domain/fan/FanContext";
import { StadiumEvent } from "@/domain/events/StadiumEvent";
import { Recommendation } from "@/domain/recommendation/Recommendation";
import { DecisionEngine } from "./decisionEngine";
import { getRelevantEvents } from "./impactAnalyzer";

interface DecisionState {
  lastHash: string;
  lastComputedAt: number;
  isComputing: boolean;
  expiresAt?: number;
}

// In-memory state store for the hackathon
const stateMap = new Map<string, DecisionState>();

const COOLDOWN_MS = 30000; // 30 seconds

export interface CoordinatorResult {
  status: "cached" | "cooldown" | "processing" | "generated" | "error";
  recommendation?: Recommendation | null;
}

export class DecisionCoordinator {
  static async requestDecision(
    fan: FanContext,
    allActiveEvents: StadiumEvent[],
    matchStatus?: any
  ): Promise<CoordinatorResult> {
    const now = Date.now();
    const fanId = fan.id;
    const state = stateMap.get(fanId) || {
      lastHash: "",
      lastComputedAt: 0,
      isComputing: false,
    };

    // 1. Concurrency Check
    if (state.isComputing) {
      console.log(`[Coordinator] [${fanId}] Reason: Processing (Concurrency lock active)`);
      return { status: "processing" };
    }

    const relevantEvents = getRelevantEvents(fan, allActiveEvents);

    // 2. Hash Generation
    const phase = matchStatus || "pre_match";
    const key = JSON.stringify({
      fan: fanId,
      phase,
      events: relevantEvents
        .map((e) => ({
          id: e.id,
          severity: e.severity,
          status: e.status,
        }))
        .sort((a, b) => a.id.localeCompare(b.id)),
    });

    const isContextChanged = key !== state.lastHash;
    const isExpired = state.expiresAt ? now > state.expiresAt : false;
    const hasCritical = relevantEvents.some((e) => e.severity === "critical");
    const isCooldownActive = now - state.lastComputedAt < COOLDOWN_MS;

    // 3. Expiration Check
    if (!isContextChanged && !isExpired) {
      console.log(`[Coordinator] [${fanId}] Reason: Cache hit (Context unchanged & not expired)`);
      return { status: "cached" };
    }

    // 4. Cooldown Check (with Critical Override)
    if (isCooldownActive && !hasCritical && !isExpired) {
      const remaining = Math.round((COOLDOWN_MS - (now - state.lastComputedAt)) / 1000);
      console.log(`[Coordinator] [${fanId}] Reason: Cooldown (${remaining}s remaining)`);
      return { status: "cooldown" };
    }

    if (hasCritical && isCooldownActive) {
      console.log(`[Coordinator] [${fanId}] Reason: Critical override (Bypassing cooldown)`);
    } else if (isExpired) {
      console.log(`[Coordinator] [${fanId}] Reason: Recommendation expired`);
    } else {
      console.log(`[Coordinator] [${fanId}] Reason: Context changed`);
    }

    // 5. Execute Gemini (Lock)
    state.isComputing = true;
    stateMap.set(fanId, state);

    try {
      const recommendation = await DecisionEngine.generateNextBestAction(
        fan,
        allActiveEvents,
        matchStatus
      );

      // 6. Update State
      state.lastHash = key;
      state.lastComputedAt = Date.now();
      state.expiresAt = recommendation?.expiresAt
        ? new Date(recommendation.expiresAt).getTime()
        : undefined;

      return { status: "generated", recommendation };
    } catch (error) {
      console.error(`[Coordinator] [${fanId}] Error generating decision:`, error);
      return { status: "error" };
    } finally {
      state.isComputing = false;
      stateMap.set(fanId, state);
    }
  }
}
