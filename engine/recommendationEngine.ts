import { Recommendation, RecommendationReason } from "@/domain/recommendation/Recommendation";
import { generateId } from "@/lib/utils";
import { calculatePriority, getExpirationTime } from "./priorityEngine";
import { StadiumEvent } from "@/domain/events/StadiumEvent";

/**
 * The raw output format expected from Gemini.
 */
export interface GeminiRecommendationOutput {
  title: string;
  summary: string;
  action: string;
  confidence: number;
  explanation: RecommendationReason[];
  affectedEvents: string[];
}

/**
 * Validates and maps the Gemini output to our internal Domain Model.
 */
export function buildRecommendation(
  parsedOutput: Partial<GeminiRecommendationOutput>,
  relevantEvents: StadiumEvent[],
  currentTime: string
): Recommendation {
  // Validate required fields (in a production system, use Zod for this)
  if (!parsedOutput.title || !parsedOutput.action || !parsedOutput.affectedEvents) {
    throw new Error("Invalid Gemini output: missing required fields");
  }

  // Find the actual events that were referenced to calculate priority accurately
  const affectedEventIds = Array.isArray(parsedOutput.affectedEvents) 
    ? parsedOutput.affectedEvents 
    : [];
    
  const actuallyAffectedEvents = relevantEvents.filter(e => affectedEventIds.includes(e.id));
  
  const priority = calculatePriority(actuallyAffectedEvents.length > 0 ? actuallyAffectedEvents : relevantEvents);
  const expiresAt = getExpirationTime(priority, currentTime);

  const recommendation: Recommendation = {
    id: `rec_${generateId()}`,
    title: parsedOutput.title,
    summary: parsedOutput.summary || "",
    action: parsedOutput.action,
    priority,
    confidence: parsedOutput.confidence || 0.9,
    explanation: Array.isArray(parsedOutput.explanation) ? parsedOutput.explanation : [],
    affectedEvents: affectedEventIds,
    status: "ACTIVE",
    generatedAt: currentTime,
    expiresAt,
  };

  return recommendation;
}
