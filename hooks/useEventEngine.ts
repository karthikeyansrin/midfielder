import { useEffect, useState, useCallback } from 'react';
import { EventEngine } from '@/engine/eventEngine';
import { SimulatorProvider } from '@/engine/events/providers/SimulatorProvider';
import { StadiumEvent } from '@/domain/events/StadiumEvent';

// Singleton instance to ensure it persists across hot-reloads and re-renders
const engine = new EventEngine();
const simulator = new SimulatorProvider();
engine.registerProvider(simulator);

export function useEventEngine() {
  const [events, setEvents] = useState<StadiumEvent[]>([]);
  // We need to force a re-render when simulation state changes
  const [isSimulating, setIsSimulating] = useState(!simulator.isPaused);

  useEffect(() => {
    // Initial fetch
    setEvents(engine.getAllEvents ? engine.getAllEvents() : engine.filterEvents({}));
    setIsSimulating(!simulator.isPaused);

    // Subscribe to updates
    const unsubscribe = engine.subscribe(() => {
      setEvents(engine.getAllEvents ? engine.getAllEvents() : engine.filterEvents({}));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const pause = useCallback(() => {
    simulator.pause();
    setIsSimulating(false);
  }, []);

  const resume = useCallback(() => {
    simulator.resume();
    setIsSimulating(true);
  }, []);

  const generateEvent = useCallback(() => {
    simulator.generateManualEvent();
  }, []);

  const clearEvents = useCallback(() => {
    engine.clearEvents();
  }, []);

  const resolveEvent = useCallback((id: string, notes?: string) => {
    engine.resolveEvent(id, notes);
  }, []);

  return { 
    events, 
    isSimulating,
    pause,
    resume,
    generateEvent,
    clearEvents,
    resolveEvent
  };
}
