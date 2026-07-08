// ─────────────────────────────────────────────
//  Gemini Service — MIDFIELDER platform
//  Server-side prompt abstractions. Business logic TBD.
// ─────────────────────────────────────────────

import type { FanProfile } from "@/types/fan";
import type { Match } from "@/types/match";
import { FAN_INSIGHT_PROMPT } from "@/prompts/fanInsight";
import { ADMIN_ANALYSIS_PROMPT } from "@/prompts/adminAnalysis";

export interface GeminiRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiResponse {
  text: string;
  model: string;
  promptTokens?: number;
  outputTokens?: number;
  finishReason?: string;
}

/**
 * Send a raw prompt to Gemini and return the response.
 * TODO: Call generateText() from lib/gemini.ts
 */
export async function callGemini(request: GeminiRequest): Promise<GeminiResponse> {
  console.log("[geminiService] callGemini:", request.prompt.slice(0, 80), "...");
  return {
    text: "Gemini response placeholder — implement with lib/gemini.ts generateText()",
    model: request.model ?? "gemini-2.5-pro",
  };
}

/**
 * Generate a personalised fan insight for a given fan profile and match.
 * TODO: Build prompt from FAN_INSIGHT_PROMPT template and call Gemini
 */
export async function generateFanInsight(
  fan: FanProfile,
  match: Match
): Promise<string> {
  const prompt = FAN_INSIGHT_PROMPT(fan, match);
  console.log("[geminiService] generateFanInsight for fan:", fan.id);
  return `Fan insight for ${fan.displayName} — implement with Gemini. Prompt length: ${prompt.length}`;
}

/**
 * Generate an admin analysis report for match and stadium data.
 * TODO: Build prompt from ADMIN_ANALYSIS_PROMPT template and call Gemini
 */
export async function generateAdminAnalysis(
  matchId: string,
  metrics: Record<string, unknown>
): Promise<string> {
  const prompt = ADMIN_ANALYSIS_PROMPT(matchId, metrics);
  console.log("[geminiService] generateAdminAnalysis for match:", matchId);
  return `Admin analysis for match ${matchId} — implement with Gemini. Prompt length: ${prompt.length}`;
}
