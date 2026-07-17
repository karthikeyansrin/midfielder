"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StadiumEvent, StadiumSimulationConfig } from "@/types/event";
import { API_ROUTES } from "@/lib/constants";

const SCENARIOS: Array<{
  id: StadiumSimulationConfig["scenarioType"];
  label: string;
  description: string;
  severity: "info" | "warning" | "critical";
}> = [
  { id: "normal", label: "Normal Operations", description: "Routine matchday event flow", severity: "info" },
  { id: "crowd_surge", label: "Crowd Surge", description: "High-density crowd movement event", severity: "warning" },
  { id: "weather_delay", label: "Weather Delay", description: "Storm delay and player evacuation", severity: "warning" },
  { id: "security_alert", label: "Security Alert", description: "Unverified threat — security response", severity: "critical" },
  { id: "power_outage", label: "Power Outage", description: "Partial floodlight failure", severity: "critical" },
];

const INTENSITIES: StadiumSimulationConfig["intensity"][] = ["low", "medium", "high"];

const SEVERITY_STYLES: Record<string, string> = {
  info: "border-[rgba(59,130,246,0.3)] bg-[var(--accent-blue-glow)] text-[var(--accent-blue)]",
  warning: "border-[rgba(245,158,11,0.3)] bg-[var(--accent-amber-glow)] text-[var(--accent-amber)]",
  critical: "border-[rgba(239,68,68,0.3)] bg-[var(--accent-red-glow)] text-[var(--accent-red)]",
  success: "border-[rgba(16,185,129,0.3)] bg-[var(--accent-emerald-glow)] text-[var(--accent-emerald)]",
};

export function EventSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<StadiumSimulationConfig["scenarioType"]>("normal");
  const [intensity, setIntensity] = useState<StadiumSimulationConfig["intensity"]>("medium");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<StadiumEvent[]>([]);

  const handleSimulate = async () => {
    setIsRunning(true);
    setResults([]);
    try {
      const res = await fetch(API_ROUTES.stadiumSimulate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: "match_sim_demo",
          scenarioType: selectedScenario,
          intensity,
          durationMinutes: 5,
        } satisfies StadiumSimulationConfig),
      });
      const data = await res.json() as { events?: StadiumEvent[] };
      setResults(data.events ?? []);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div
      id="event-simulator"
      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--border-subtle)]">
        <Activity className="h-4 w-4 text-[var(--accent-amber)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Stadium Event Simulator
        </h3>
        <Badge
          variant="outline"
          className="ml-auto text-[10px] border-[var(--accent-amber-border)] text-[var(--accent-amber)]"
        >
          DEMO MODE
        </Badge>
      </div>

      <div className="p-5 space-y-5">
        {/* Scenario selection */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Scenario
          </p>
          <div className="space-y-2" role="group" aria-label="Scenario">
            {SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                id={`simulator-scenario-${scenario.id}`}
                aria-pressed={selectedScenario === scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={cn(
                  "w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm text-left transition-all",
                  selectedScenario === scenario.id
                    ? "border-[var(--accent-amber-border)] bg-[var(--accent-amber-glow)]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--border-default)]"
                )}
              >
                <div>
                  <p className={cn("font-medium", selectedScenario === scenario.id ? "text-[var(--accent-amber)]" : "text-[var(--text-secondary)]")}>
                    {scenario.label}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">{scenario.description}</p>
                </div>
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold shrink-0 ml-3", SEVERITY_STYLES[scenario.severity])}>
                  {scenario.severity}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Intensity */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Intensity
          </p>
          <div className="flex gap-2" role="group" aria-label="Intensity">
            {INTENSITIES.map((level) => (
              <button
                key={level}
                id={`simulator-intensity-${level}`}
                aria-pressed={intensity === level}
                onClick={() => setIntensity(level)}
                className={cn(
                  "flex-1 rounded-lg border py-2 text-xs font-medium capitalize transition-all",
                  intensity === level
                    ? "border-[var(--accent-amber-border)] bg-[var(--accent-amber-glow)] text-[var(--accent-amber)]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:border-[var(--border-default)] hover:text-[var(--text-secondary)]"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Run button */}
        <Button
          id="simulator-run-btn"
          onClick={handleSimulate}
          disabled={isRunning}
          className="w-full bg-[var(--accent-amber)] text-black hover:bg-[var(--accent-amber-dim)] font-semibold"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Simulating…
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Simulation
            </>
          )}
        </Button>

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[var(--border-subtle)] pt-4 space-y-2"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-[var(--accent-emerald)]" />
                Generated {results.length} events. This may trigger new AI recommendations.
              </p>
              {results.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-3 py-2.5",
                    SEVERITY_STYLES[event.severity]
                  )}
                >
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold">{event.title}</p>
                    <p className="text-[10px] opacity-80">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
