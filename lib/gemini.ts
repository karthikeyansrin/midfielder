// ─────────────────────────────────────────────
//  Google Gemini client initialization — MIDFIELDER
//  Server-side only. Never expose API key to client.
// ─────────────────────────────────────────────

import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

// Default model to use — override per-request as needed
export const DEFAULT_GEMINI_MODEL = "gemini-2.5-pro" as const;
export const FAST_GEMINI_MODEL = "gemini-2.5-flash" as const;

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Returns a Gemini GenerativeModel instance.
 * @param modelName - Defaults to DEFAULT_GEMINI_MODEL
 */
export function getGeminiModel(modelName = DEFAULT_GEMINI_MODEL): GenerativeModel {
  return getGenAI().getGenerativeModel({ model: modelName });
}

/**
 * Simple text generation helper.
 * @param prompt - The full prompt string
 * @param modelName - Optional model override
 */
export async function generateText(
  prompt: string,
  modelName = DEFAULT_GEMINI_MODEL
): Promise<string> {
  const model = getGeminiModel(modelName);
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
