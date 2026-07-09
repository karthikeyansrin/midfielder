import { NextResponse } from "next/server";
import { DecisionEngine } from "@/engine/decisionEngine";
import { FanContext } from "@/domain/fan/FanContext";
import { StadiumEvent } from "@/domain/events/StadiumEvent";

interface DecisionRequest {
  fan: FanContext;
  events: StadiumEvent[];
}

export async function POST(request: Request) {
  try {
    const body: DecisionRequest = await request.json();

    if (!body.fan || !body.events) {
      return NextResponse.json(
        { error: "Missing fan context or events in request body" },
        { status: 400 }
      );
    }

    // The API acts as the boundary, delegating to the DecisionEngine
    // which internally constructs the trusted DecisionContext.
    const recommendation = await DecisionEngine.generateNextBestAction(
      body.fan,
      body.events
    );

    if (!recommendation) {
      return NextResponse.json({ recommendation: null });
    }

    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error("Error in /api/decision:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}
