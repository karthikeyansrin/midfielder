import { describe, it, expect } from "vitest";
import { getRelevantEvents } from "@/engine/impactAnalyzer";
import { FanContext } from "@/domain/fan/FanContext";
import { StadiumEvent } from "@/domain/events/StadiumEvent";

describe("getRelevantEvents", () => {
  const mockFan: FanContext = {
    id: "fan123",
    displayName: "Test Fan",
    matchInfo: {
      matchId: "m1",
      stadiumId: "s1",
      section: "A1",
    },
    travelProfile: {
      modeOfTransport: "Metro",
      arrivalTime: "18:00",
      departurePlan: "Stay after match",
      parkingRequired: false,
    },
    preferences: {
      interestedInFood: true,
      interestedInMerch: true,
      interestedInExperiences: true,
      favoriteTeam: "Home",
      notificationPreference: "Balanced",
    },
    accessibility: {
      wheelchairAssistance: false,
      elderlyCompanion: false,
      childrenAccompanying: false,
      medicalAssistanceRequired: false,
      visualOrHearingNeeds: false,
    },
    updatedAt: new Date().toISOString(),
  };

  const createEvent = (
    id: string,
    severity: "low" | "medium" | "high" | "critical",
    category: StadiumEvent["category"] = "security",
    title: string = "Test Event",
    affectedZones: string[] = []
  ): StadiumEvent => ({
    id,
    timestamp: new Date().toISOString(),
    category,
    severity,
    title,
    description: "Test description",
    location: {},
    affectedZones,
    status: "active",
    source: "test",
  });

  it("should include critical and high severity events regardless of other factors", () => {
    const criticalEvent = createEvent("1", "critical");
    const highEvent = createEvent("2", "high");
    
    const relevant = getRelevantEvents(mockFan, [criticalEvent, highEvent]);
    expect(relevant).toHaveLength(2);
  });

  it("should include operational metro events if fan uses Metro", () => {
    const metroEvent = createEvent("3", "low", "operational", "Metro delay");
    
    const relevant = getRelevantEvents(mockFan, [metroEvent]);
    expect(relevant).toHaveLength(1);
    expect(relevant[0].id).toBe("3");
  });

  it("should not include operational metro events if fan does not use Metro", () => {
    const nonMetroFan = {
      ...mockFan,
      travelProfile: { ...mockFan.travelProfile, modeOfTransport: "Taxi" as const },
    };
    const metroEvent = createEvent("3", "low", "operational", "Metro delay");
    
    const relevant = getRelevantEvents(nonMetroFan, [metroEvent]);
    expect(relevant).toHaveLength(0);
  });

  it("should include events affecting the fan's section", () => {
    const sectionEvent = createEvent("4", "medium", "maintenance", "Spill", ["A1"]);
    
    const relevant = getRelevantEvents(mockFan, [sectionEvent]);
    expect(relevant).toHaveLength(1);
    expect(relevant[0].id).toBe("4");
  });

  it("should include events affecting 'all' zones", () => {
    const allZoneEvent = createEvent("5", "low", "marketing", "Promo", ["all"]);
    
    const relevant = getRelevantEvents(mockFan, [allZoneEvent]);
    expect(relevant).toHaveLength(1);
    expect(relevant[0].id).toBe("5");
  });
});
