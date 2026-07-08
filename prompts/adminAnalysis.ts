// ─────────────────────────────────────────────
//  Admin Analysis Prompts — MIDFIELDER platform
//  Structured Gemini prompts for admin AI features.
// ─────────────────────────────────────────────

/**
 * Generate an admin analysis prompt for a completed match.
 * Used by geminiService.generateAdminAnalysis()
 */
export function ADMIN_ANALYSIS_PROMPT(
  matchId: string,
  metrics: Record<string, unknown>
): string {
  return `
You are MIDFIELDER AI, an intelligent stadium management assistant.

## Match Reference
- Match ID: ${matchId}

## Platform Metrics
${JSON.stringify(metrics, null, 2)}

## Task
Generate a concise operational analysis report for stadium management (4-5 sentences).
Include observations on fan engagement, stadium occupancy, operational incidents,
and 2-3 actionable recommendations for the next match day.
Use a professional, data-driven tone appropriate for stadium executives.
`.trim();
}

/**
 * Generate a crowd safety analysis prompt.
 * Used by admin simulator to flag potential safety concerns.
 */
export function CROWD_SAFETY_PROMPT(
  zoneId: string,
  occupancy: number,
  capacity: number,
  eventHistory: string[]
): string {
  const occupancyPercent = Math.round((occupancy / capacity) * 100);

  return `
You are MIDFIELDER AI, providing crowd safety analysis for stadium operations.

## Zone: ${zoneId}
- Current Occupancy: ${occupancy} / ${capacity} (${occupancyPercent}%)
- Recent Events: ${eventHistory.join(", ") || "None"}

## Task
Assess the crowd safety risk level (Low / Medium / High / Critical) for this zone.
Provide a 2-sentence justification and one immediate recommended action.
Format the response as JSON: { "riskLevel": string, "justification": string, "action": string }
`.trim();
}

/**
 * Generate a fan engagement summary prompt for weekly admin reports.
 */
export function WEEKLY_ENGAGEMENT_PROMPT(
  weekStartDate: string,
  totalFans: number,
  activeFans: number,
  topEvents: string[]
): string {
  return `
You are MIDFIELDER AI, generating a weekly fan engagement report.

## Week: ${weekStartDate}
- Total Registered Fans: ${totalFans}
- Active This Week: ${activeFans}
- Top Events: ${topEvents.join(", ")}

## Task
Write a 3-4 sentence executive summary of fan engagement for this week.
Highlight trends, notable engagement spikes, and one growth opportunity.
Keep it concise and suitable for a C-suite audience.
`.trim();
}
