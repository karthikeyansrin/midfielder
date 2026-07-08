import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/decide
 * Proxy to Gemini reasoning models.
 * Business logic TBD — currently returns a typed stub.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      prompt?: string;
      model?: string;
      context?: Record<string, unknown>;
    };

    if (!body.prompt) {
      return NextResponse.json(
        { error: "Missing required field: prompt" },
        { status: 400 }
      );
    }

    // TODO: Call geminiService.callGemini() here
    // const { generateText } = await import("@/lib/gemini");
    // const text = await generateText(body.prompt, body.model);

    const response = {
      text: `[MIDFIELDER AI] Stub response for: "${body.prompt.slice(0, 60)}…"`,
      model: body.model ?? "gemini-2.5-pro",
      promptTokens: body.prompt.split(/\s+/).length,
      outputTokens: 24,
      finishReason: "STOP",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[/api/decide] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/decide — health check
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/decide",
    description: "Gemini AI reasoning proxy",
    supportedModels: ["gemini-2.5-pro", "gemini-2.5-flash"],
  });
}
