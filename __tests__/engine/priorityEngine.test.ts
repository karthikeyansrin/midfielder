import { describe, it, expect } from "vitest";
import { calculatePriority, getExpirationTime } from "@/engine/priorityEngine";
import { StadiumEvent } from "@/domain/events/StadiumEvent";

describe("priorityEngine", () => {
  const createEvent = (severity: StadiumEvent["severity"]): StadiumEvent => ({
    id: "1",
    timestamp: new Date().toISOString(),
    category: "security",
    severity,
    title: "Test",
    description: "Test",
    location: {},
    affectedZones: [],
    status: "active",
    source: "test",
  });

  describe("calculatePriority", () => {
    it("should return CRITICAL if any event is critical", () => {
      const events = [createEvent("low"), createEvent("critical"), createEvent("high")];
      expect(calculatePriority(events)).toBe("CRITICAL");
    });

    it("should return HIGH if any event is high and none are critical", () => {
      const events = [createEvent("low"), createEvent("high"), createEvent("medium")];
      expect(calculatePriority(events)).toBe("HIGH");
    });

    it("should return MEDIUM if highest severity is medium", () => {
      const events = [createEvent("low"), createEvent("medium")];
      expect(calculatePriority(events)).toBe("MEDIUM");
    });

    it("should return LOW if highest severity is low", () => {
      const events = [createEvent("low")];
      expect(calculatePriority(events)).toBe("LOW");
    });

    it("should return INFO for empty events array", () => {
      expect(calculatePriority([])).toBe("INFO");
    });
  });

  describe("getExpirationTime", () => {
    const baseTime = "2026-07-17T12:00:00.000Z";
    
    it("should add 2 minutes for CRITICAL priority", () => {
      const exp = getExpirationTime("CRITICAL", baseTime);
      expect(exp).toBe("2026-07-17T12:02:00.000Z");
    });

    it("should add 5 minutes for HIGH priority", () => {
      const exp = getExpirationTime("HIGH", baseTime);
      expect(exp).toBe("2026-07-17T12:05:00.000Z");
    });

    it("should add 15 minutes for MEDIUM priority", () => {
      const exp = getExpirationTime("MEDIUM", baseTime);
      expect(exp).toBe("2026-07-17T12:15:00.000Z");
    });

    it("should add 30 minutes for LOW priority", () => {
      const exp = getExpirationTime("LOW", baseTime);
      expect(exp).toBe("2026-07-17T12:30:00.000Z");
    });

    it("should add 60 minutes for INFO priority", () => {
      const exp = getExpirationTime("INFO", baseTime);
      expect(exp).toBe("2026-07-17T13:00:00.000Z");
    });
  });
});
