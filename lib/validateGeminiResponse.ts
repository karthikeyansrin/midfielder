import { GeminiRecommendationOutput } from "@/engine/recommendationEngine";

export function validateRecommendation(
  obj: unknown
): asserts obj is GeminiRecommendationOutput {
  if (!obj || typeof obj !== "object") {
    throw new Error("Gemini output is not an object.");
  }

  const rec = obj as GeminiRecommendationOutput;

  if (!rec.title) throw new Error("Missing title.");
  if (!rec.action) throw new Error("Missing action.");
  if (!Array.isArray(rec.explanation))
    throw new Error("Explanation must be an array.");
}
