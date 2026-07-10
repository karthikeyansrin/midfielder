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

export class DecisionEngine {
  /**
   * Orchestrates the entire recommendation pipeline.
   * Assembles context, filters events, queries Gemini, and builds the final model.
   */
  static async generateNextBestAction(
    fan: FanContext,
    allActiveEvents: StadiumEvent[],
    matchStatus?: any
  ): Promise<Recommendation | null> {
    const currentTime = new Date().toISOString();

    // 1. Build Decision Context natively inside the engine
    const context: DecisionContext = {
      fan,
      activeEvents: allActiveEvents,
      currentTime,
      matchStatus: matchStatus ? { state: matchStatus } : { state: "pre_match" },
      stadiumState: { currentCapacity: 45000 } // stubbed for now
    };

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
