import { NextRequest, NextResponse } from "next/server";
import { runStadiumSimulation } from "@/services/stadiumService";
import type { StadiumSimulationConfig } from "@/types/event";

/**
 * POST /api/stadium/simulate
 * Triggers a stadium event simulation and returns generated events.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Partial<StadiumSimulationConfig>;

    // Validate required fields
    if (!body.matchId || !body.scenarioType || !body.intensity) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["matchId", "scenarioType", "intensity"],
        },
        { status: 400 }
      );
    }

    // Validate enum values
    const validScenarios: StadiumSimulationConfig["scenarioType"][] = [
      "normal", "crowd_surge", "weather_delay", "security_alert", "power_outage",
    ];
    const validIntensities: StadiumSimulationConfig["intensity"][] = ["low", "medium", "high"];

    if (!validScenarios.includes(body.scenarioType)) {
      return NextResponse.json(
        { error: `Invalid scenarioType. Valid values: ${validScenarios.join(", ")}` },
        { status: 400 }
      );
    }
    if (!validIntensities.includes(body.intensity)) {
      return NextResponse.json(
        { error: `Invalid intensity. Valid values: ${validIntensities.join(", ")}` },
        { status: 400 }
      );
    }

    const config: StadiumSimulationConfig = {
      matchId: body.matchId,
      scenarioType: body.scenarioType,
      intensity: body.intensity,
      durationMinutes: body.durationMinutes ?? 5,
    };

    const result = await runStadiumSimulation(config);

    // TODO: Write generated events to Firestore via firestoreService.writeStadiumEvents()
    // await writeStadiumEvents(result.events);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[/api/stadium/simulate] Error:", error);
    return NextResponse.json(
      { error: "Simulation failed — internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stadium/simulate — available scenarios and config
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/stadium/simulate",
    description: "Stadium event simulation engine",
    availableScenarios: ["normal", "crowd_surge", "weather_delay", "security_alert", "power_outage"],
    availableIntensities: ["low", "medium", "high"],
    requiredFields: ["matchId", "scenarioType", "intensity"],
    optionalFields: { durationMinutes: "default: 5" },
  });
}
