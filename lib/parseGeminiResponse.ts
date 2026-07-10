export class GeminiParseError extends Error {
  constructor(message: string, public rawResponse: string) {
    super(message);
    this.name = "GeminiParseError";
  }
}

export function parseGeminiResponse<T>(response: string): T {
  if (!response?.trim()) {
    throw new GeminiParseError("Gemini returned an empty response.", response);
  }

  let cleaned = response.trim();

  // Remove markdown fences
  cleaned = cleaned
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  // Find the first JSON object in the response
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new GeminiParseError(
      "No valid JSON object found in Gemini response.",
      response
    );
  }

  cleaned = cleaned.substring(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    throw new GeminiParseError(
      `Failed to parse Gemini JSON: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
      cleaned
    );
  }
}
