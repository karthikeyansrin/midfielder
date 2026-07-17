import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DecisionCoordinator } from "@/engine/decisionCoordinator";
import { DecisionEngine } from "@/engine/decisionEngine";
import { FanContext } from "@/domain/fan/FanContext";
import { StadiumEvent } from "@/domain/events/StadiumEvent";
import { Recommendation } from "@/domain/recommendation/Recommendation";

// Mock DecisionEngine
vi.mock("@/engine/decisionEngine", () => ({
  DecisionEngine: {
    generateNextBestAction: vi.fn(),
  },
}));

describe("DecisionCoordinator", () => {
  const mockFan: FanContext = {
    id: "fan1",
    displayName: "Fan",
    matchInfo: { matchId: "m1", stadiumId: "s1", section: "A1" },
    travelProfile: { modeOfTransport: "Metro", arrivalTime: "18:00", departurePlan: "Flexible", parkingRequired: false },
    preferences: { interestedInFood: true, interestedInMerch: false, interestedInExperiences: false, favoriteTeam: "Home", notificationPreference: "Balanced" },
    accessibility: { wheelchairAssistance: false, elderlyCompanion: false, childrenAccompanying: false, medicalAssistanceRequired: false, visualOrHearingNeeds: false },
    updatedAt: "2026-07-17T12:00:00Z",
  };

  const createEvent = (id: string, severity: StadiumEvent["severity"] = "low"): StadiumEvent => ({
    id, timestamp: "2026-07-17T12:00:00Z", category: "security", severity, title: "Test", description: "Test", location: {}, affectedZones: ["A1"], status: "active", source: "test",
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-17T12:00:00Z"));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return 'generated' on first call", async () => {
    const mockRec: Recommendation = {
      id: "rec_1", title: "Test", action: "Action", priority: "LOW", confidence: 0.9, explanation: [], affectedEvents: [], status: "ACTIVE", generatedAt: "2026-07-17T12:00:00Z",
    };
    vi.mocked(DecisionEngine.generateNextBestAction).mockResolvedValueOnce(mockRec);

    const result = await DecisionCoordinator.requestDecision(mockFan, []);
    expect(result.status).toBe("generated");
    expect(result.recommendation).toEqual(mockRec);
    expect(DecisionEngine.generateNextBestAction).toHaveBeenCalledTimes(1);
  });

  it("should return 'cached' when context is unchanged", async () => {
    // Note: since stateMap is module-scoped, the previous test's state persists unless we mock it or use a different fanId.
    // Let's use a new fanId to ensure clean state.
    const fan2 = { ...mockFan, id: "fan2" };
    vi.mocked(DecisionEngine.generateNextBestAction).mockResolvedValueOnce(null);

    await DecisionCoordinator.requestDecision(fan2, []); // First call
    const result2 = await DecisionCoordinator.requestDecision(fan2, []); // Second call immediately

    expect(result2.status).toBe("cached");
    expect(DecisionEngine.generateNextBestAction).toHaveBeenCalledTimes(1);
  });

  it("should return 'cooldown' when context changed but within cooldown window", async () => {
    const fan3 = { ...mockFan, id: "fan3" };
    vi.mocked(DecisionEngine.generateNextBestAction).mockResolvedValueOnce(null);

    await DecisionCoordinator.requestDecision(fan3, []); // First call
    
    // Add a non-critical event to change context
    const event = createEvent("e1", "low");
    
    // Advance time by 10s (within 30s cooldown)
    vi.advanceTimersByTime(10000);
    
    const result2 = await DecisionCoordinator.requestDecision(fan3, [event]);

    expect(result2.status).toBe("cooldown");
    expect(DecisionEngine.generateNextBestAction).toHaveBeenCalledTimes(1);
  });

  it("should override cooldown if new critical event appears", async () => {
    const fan4 = { ...mockFan, id: "fan4" };
    vi.mocked(DecisionEngine.generateNextBestAction).mockResolvedValue(null);

    await DecisionCoordinator.requestDecision(fan4, []); // First call
    
    // Add a critical event
    const critEvent = createEvent("c1", "critical");
    
    // Advance time by 10s (within 30s cooldown)
    vi.advanceTimersByTime(10000);
    
    const result2 = await DecisionCoordinator.requestDecision(fan4, [critEvent]);

    expect(result2.status).toBe("generated");
    expect(DecisionEngine.generateNextBestAction).toHaveBeenCalledTimes(2);
  });
});
