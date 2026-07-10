import { useEventEngine } from "@/hooks/useEventEngine";
import { Button } from "@/components/ui/button";
import { Play, Pause, Zap, Trash2 } from "lucide-react";

export function EventGenerator() {
  const { isSimulating, pause, resume, generateEvent, clearEvents } = useEventEngine();

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 flex flex-col space-y-6">
      <div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">Simulator Controls</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Manage the flow of simulated events into the engine.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={generateEvent}
          className="w-full justify-start bg-[var(--accent-blue)] text-white hover:bg-blue-600"
        >
          <Zap className="mr-2 h-4 w-4" />
          Generate Random Event
        </Button>

        {isSimulating ? (
          <Button
            onClick={pause}
            variant="outline"
            className="w-full justify-start border-[rgba(245,158,11,0.5)] text-[var(--accent-amber)] hover:bg-[var(--accent-amber-glow)] hover:text-[var(--accent-amber)]"
          >
            <Pause className="mr-2 h-4 w-4" />
            Pause Simulation
          </Button>
        ) : (
          <Button
            onClick={resume}
            variant="outline"
            className="w-full justify-start border-[rgba(16,185,129,0.5)] text-[var(--accent-emerald)] hover:bg-[var(--accent-emerald-glow)] hover:text-[var(--accent-emerald)]"
          >
            <Play className="mr-2 h-4 w-4" />
            Resume Simulation
          </Button>
        )}

        <div className="pt-4 mt-2 border-t border-[var(--border-subtle)]">
          <Button
            onClick={clearEvents}
            variant="ghost"
            className="w-full justify-start text-[var(--text-muted)] hover:text-[var(--accent-red)] hover:bg-[var(--accent-red-glow)]"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear History
          </Button>
        </div>
      </div>
    </div>
  );
}
