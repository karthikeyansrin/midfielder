import { describe, it, expect } from "vitest";
import { parseGeminiResponse, GeminiParseError } from "@/lib/parseGeminiResponse";

describe("parseGeminiResponse", () => {
  it("should parse clean JSON", () => {
    const input = '{"test": "value"}';
    const result = parseGeminiResponse<{ test: string }>(input);
    expect(result.test).toBe("value");
  });

  it("should strip markdown fences and parse", () => {
    const input = '```json\n{"test": "value"}\n```';
    const result = parseGeminiResponse<{ test: string }>(input);
    expect(result.test).toBe("value");
  });

  it("should extract JSON embedded in surrounding text", () => {
    const input = 'Here is your recommendation:\n{"test": "value"}\nHope this helps!';
    const result = parseGeminiResponse<{ test: string }>(input);
    expect(result.test).toBe("value");
  });

  it("should throw GeminiParseError on empty string", () => {
    expect(() => parseGeminiResponse("")).toThrow(GeminiParseError);
    expect(() => parseGeminiResponse("   ")).toThrow(GeminiParseError);
  });

  it("should throw GeminiParseError if no braces are found", () => {
    const input = "Just some plain text without JSON";
    expect(() => parseGeminiResponse(input)).toThrow(GeminiParseError);
  });

  it("should throw GeminiParseError on invalid JSON", () => {
    const input = '{"test": "value", }'; // Trailing comma
    expect(() => parseGeminiResponse(input)).toThrow(GeminiParseError);
  });
});
