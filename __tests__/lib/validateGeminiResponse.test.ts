import { describe, it, expect } from "vitest";
import { validateRecommendation } from "@/lib/validateGeminiResponse";

describe("validateRecommendation", () => {
  it("should pass with valid recommendation object", () => {
    const validRec = {
      title: "Test",
      action: "Test Action",
      explanation: [{ description: "Reason" }],
      affectedEvents: [],
    };
    expect(() => validateRecommendation(validRec)).not.toThrow();
  });

  it("should throw if not an object", () => {
    expect(() => validateRecommendation(null)).toThrow("Gemini output is not an object.");
    expect(() => validateRecommendation("string")).toThrow("Gemini output is not an object.");
  });

  it("should throw if missing title", () => {
    const invalidRec = {
      action: "Test Action",
      explanation: [],
    };
    expect(() => validateRecommendation(invalidRec)).toThrow("Missing title.");
  });

  it("should throw if missing action", () => {
    const invalidRec = {
      title: "Test",
      explanation: [],
    };
    expect(() => validateRecommendation(invalidRec)).toThrow("Missing action.");
  });

  it("should throw if explanation is not an array", () => {
    const invalidRec = {
      title: "Test",
      action: "Test Action",
      explanation: "This is a string, not an array",
    };
    expect(() => validateRecommendation(invalidRec)).toThrow("Explanation must be an array.");
  });
});
