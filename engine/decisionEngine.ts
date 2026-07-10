import { DecisionContext } from "@/domain/decision/DecisionContext";
import { Recommendation } from "@/domain/recommendation/Recommendation";
import { getRelevantEvents } from "./impactAnalyzer";
import { buildRecommendation, GeminiRecommendationOutput } from "./recommendationEngine";
import { generateText } from "@/lib/gemini";
import { FanContext } from "@/domain/fan/FanContext";
import { StadiumEvent } from "@/domain/events/StadiumEvent";
import { parseGeminiResponse } from "@/lib/parseGeminiResponse";
import { validateRecommendation } from "@/lib/validateGeminiResponse";
import { buildDecisionPrompt } from "@/prompts/decision.prompt";

const getValidMatchState = (status?: string): "pre_match" | "in_progress" | "half_time" | "post_match" => {
  switch (status) {
    case "kickoff":
    case "first_half":
    case "second_half":
      return "in_progress";
    case "half_time":
      return "half_time";
    case "full_time":
      return "post_match";
    case "pre_match":
    default:
      return "pre_match";
  }
};
export class DecisionEngine {
  /**
   * Core orchestration engine for generating fan recommendations.
   * 
   * Purpose: Acts as the primary pipeline connecting real-time stadium events, fan context, and Gemini AI to generate actionable insights.
   * 
   * Inputs:
   * - fan: FanContext (The personalized data of the fan)
   * - allActiveEvents: StadiumEvent[] (All current live stadium operational events)
   * - matchStatus?: string (Optional match state, e.g., 'pre_match', 'half_time')
   * 
   * Outputs:
   * - Promise<Recommendation | null>: Returns a structured Recommendation object parsed from Gemini, or null if generation fails.
   */
  private static buildContext(
    fan: FanContext,
    allActiveEvents: StadiumEvent[],
    matchStatus?: string
  ): DecisionContext {
    const currentTime = new Date().toISOString();
    return {
      fan,
      activeEvents: allActiveEvents,
      currentTime,
      matchStatus: { state: getValidMatchState(matchStatus) },
      stadiumState: { currentCapacity: 45000 } // stubbed for now
    };
  }

  static async generateNextBestAction(
    fan: FanContext,
    allActiveEvents: StadiumEvent[],
    matchStatus?: string
  ): Promise<Recommendation | null> {
    const context = this.buildContext(fan, allActiveEvents, matchStatus);
    const currentTime = context.currentTime;

    // 2. Analyze impact
    const relevantEvents = getRelevantEvents(fan, allActiveEvents);
    // 3. Query Gemini
    const prompt = buildDecisionPrompt(context, relevantEvents);
    
    try {
      const geminiResponseText = await generateText(prompt);
      
      const parsedOutput = parseGeminiResponse<GeminiRecommendationOutput>(geminiResponseText);
      
      validateRecommendation(parsedOutput);
      
      // 4. Build and return Recommendation
      return buildRecommendation(parsedOutput, relevantEvents, currentTime);
      
    } catch (error) {
      console.error("Failed to generate recommendation via Gemini:", error);
      return null;
    }
  }
}
