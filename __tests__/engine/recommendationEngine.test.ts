import { describe, it, expect } from "vitest";
import { buildRecommendation } from "@/engine/recommendationEngine";
import { StadiumEvent } from "@/domain/events/StadiumEvent";

describe("buildRecommendation", () => {
  const currentTime = "2026-07-17T12:00:00.000Z";
  
  const createEvent = (id: string, severity: StadiumEvent["severity"]): StadiumEvent => ({
    id,
    timestamp: currentTime,
    category: "security",
    severity,
    title: "Test",
    description: "Test",
    location: {},
    affectedZones: [],
    status: "active",
    source: "test",
  });

  const relevantEvents = [
    createEvent("e1", "low"),
    createEvent("e2", "high"),
  ];

  it("should build recommendation with correct structure", () => {
    const parsed = {
      title: "Test Rec",
      action: "Do something",
      affectedEvents: ["e2"],
      explanation: [{ description: "Reason 1" }],
    };

    const rec = buildRecommendation(parsed, relevantEvents, currentTime);
    
    expect(rec.id).toMatch(/^rec_/);
    expect(rec.title).toBe("Test Rec");
    expect(rec.action).toBe("Do something");
    expect(rec.affectedEvents).toEqual(["e2"]);
    expect(rec.explanation).toEqual([{ description: "Reason 1" }]);
    expect(rec.status).toBe("ACTIVE");
    expect(rec.generatedAt).toBe(currentTime);
    expect(rec.confidence).toBe(0.9); // Default
    expect(rec.priority).toBe("HIGH"); // Since e2 is high
  });

  it("should handle partial/missing fields gracefully", () => {
    const parsed = {
      title: "Test Rec",
      action: "Do something",
      affectedEvents: [],
      // Missing summary, confidence, explanation
    };

    const rec = buildRecommendation(parsed, relevantEvents, currentTime);
    
    expect(rec.summary).toBe("");
    expect(rec.confidence).toBe(0.9);
    expect(rec.explanation).toEqual([]);
    expect(rec.priority).toBe("HIGH"); // Falls back to checking all relevant events if affectedEvents is empty, actually logic: actuallyAffectedEvents.length > 0 ? actuallyAffectedEvents : relevantEvents.
  });

  it("should throw if missing required fields", () => {
    const invalidParsed = {
      title: "Test Rec",
      // missing action and affectedEvents
    };
    
    expect(() => buildRecommendation(invalidParsed, relevantEvents, currentTime)).toThrow("Invalid Gemini output: missing required fields");
  });
});
