import { DecisionContext } from "@/domain/decision/DecisionContext";
import { Recommendation } from "@/domain/recommendation/Recommendation";
import { getRelevantEvents } from "./impactAnalyzer";
import { buildRecommendation, GeminiRecommendationOutput } from "./recommendationEngine";
import { generateText } from "@/lib/gemini";
import { FanContext } from "@/domain/fan/FanContext";
import { StadiumEvent } from "@/domain/events/StadiumEvent";

export class DecisionEngine {
  /**
   * Orchestrates the entire recommendation pipeline.
   * Assembles context, filters events, queries Gemini, and builds the final model.
   */
  static async generateNextBestAction(
    fan: FanContext,
    allActiveEvents: StadiumEvent[]
  ): Promise<Recommendation | null> {
    const currentTime = new Date().toISOString();

    // 1. Build Decision Context natively inside the engine
    const context: DecisionContext = {
      fan,
      activeEvents: allActiveEvents,
      currentTime,
      matchStatus: { state: "pre_match" }, // stubbed for now
      stadiumState: { currentCapacity: 45000 } // stubbed for now
    };

    // 2. Analyze impact
    const relevantEvents = getRelevantEvents(fan, allActiveEvents);
    
    if (relevantEvents.length === 0) {
      // If nothing is happening, we might not need to suggest an action, 
      // or we can suggest a generic "Enjoy the match!"
      return null;
    }

    // 3. Query Gemini
    const prompt = this.buildGeminiPrompt(context, relevantEvents);
    
    try {
      const geminiResponseText = await generateText(prompt);
      
      // Attempt to parse JSON. We requested JSON in the prompt.
      // Often Gemini wraps JSON in markdown blocks (```json ... ```). We should strip that if present.
      const jsonMatch = geminiResponseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      const cleanJson = jsonMatch ? jsonMatch[1] : geminiResponseText;
      
      const parsedOutput = JSON.parse(cleanJson);
      
      // 4. Build and return Recommendation
      return buildRecommendation(parsedOutput, relevantEvents, currentTime);
      
    } catch (error) {
      console.error("Failed to generate recommendation via Gemini:", error);
      return null;
    }
  }

  private static buildGeminiPrompt(context: DecisionContext, relevantEvents: StadiumEvent[]): string {
    return `
You are the intelligence core of MIDFIELDER, a stadium experience platform.
Your task is to analyze the fan context and live stadium events to determine the "Next Best Action" for the fan.

Fan Context:
${JSON.stringify(context.fan, null, 2)}

Live Relevant Events:
${JSON.stringify(relevantEvents, null, 2)}

Match & Stadium State:
Match: ${JSON.stringify(context.matchStatus)}
Stadium: ${JSON.stringify(context.stadiumState)}

Instructions:
1. Determine the absolute best next action for this specific fan given the events.
2. Provide a short, actionable title and action.
3. List 1-3 reasons explaining *why* this recommendation was made.
4. Crucially, list the exact 'id's of the events that influenced this decision in the 'affectedEvents' array.

You MUST return ONLY valid JSON in the following format. Do not include markdown formatting or extra text.
{
  "title": "Short title (e.g. Leave Now)",
  "summary": "Brief summary",
  "action": "The specific action to take",
  "confidence": 0.95,
  "explanation": [
    { "description": "Reason 1" },
    { "description": "Reason 2" }
  ],
  "affectedEvents": ["evt_123", "evt_456"]
}
    `.trim();
  }
}
