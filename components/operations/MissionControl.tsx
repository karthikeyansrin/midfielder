"use client";

import { OperationsSummary } from "./OperationsSummary";
import { EventGenerator } from "./EventGenerator";
import { EventTimeline } from "./EventTimeline";

export function MissionControl() {
  return (
    <div className="space-y-6">
      <OperationsSummary />
      
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div>
          <EventGenerator />
        </div>
        <div>
          <EventTimeline />
        </div>
      </div>
    </div>
  );
}
