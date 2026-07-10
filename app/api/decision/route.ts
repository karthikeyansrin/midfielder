import { NextResponse } from "next/server";
import { DecisionCoordinator } from "@/engine/decisionCoordinator";
import { FanRepository } from "@/repositories/FanRepository";
import { EventRepository } from "@/repositories/EventRepository";
import { RecommendationRepository } from "@/repositories/RecommendationRepository";

interface DecisionRequest {
  fanId: string;
  matchStatus?: string;
}

export async function POST(request: Request) {
  try {
    const body: DecisionRequest = await request.json();

    if (!body.fanId) {
      return NextResponse.json(
        { error: "Missing fanId in request body" },
        { status: 400 }
      );
    }

    const fan = await FanRepository.getFan(body.fanId);
    if (!fan) {
      return NextResponse.json(
        { error: "Fan not found" },
        { status: 404 }
      );
    }

    const activeEvents = await EventRepository.getActiveEvents();

    const result = await DecisionCoordinator.requestDecision(
      fan,
      activeEvents,
      body.matchStatus
    );

    if (result.status === "generated" && result.recommendation) {
      await RecommendationRepository.saveRecommendation(result.recommendation, fan.id);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/decision:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}
