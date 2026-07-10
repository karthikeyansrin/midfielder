"use client";

import { useEffect, useState, useCallback } from 'react';
import { SimulatorProvider } from '@/engine/events/providers/SimulatorProvider';
import { StadiumEvent } from '@/domain/events/StadiumEvent';
import { EventRepository } from '@/repositories/EventRepository';

// Singleton instance to ensure it persists across hot-reloads and re-renders
const simulator = new SimulatorProvider();

// Start the simulator exactly once globally. It will write events directly to Firestore.
simulator.start((event) => {
  EventRepository.saveEvent(event).catch(console.error);
});

export function useEventEngine() {
  const [events, setEvents] = useState<StadiumEvent[]>([]);
  // We need to force a re-render when simulation state changes
  const [isSimulating, setIsSimulating] = useState(!simulator.isPaused);
  const [matchStatus, setMatchStatus] = useState<string>(simulator.matchStatus);

  useEffect(() => {
    setIsSimulating(!simulator.isPaused);

    // Subscribe to Firestore active events
    const unsubscribe = EventRepository.subscribeToActiveEvents((newEvents) => {
      setEvents(newEvents);
    });
    
    simulator.setMatchStatusCallback((status) => {
      setMatchStatus(status);
    });

    return () => {
      unsubscribe();
      simulator.setMatchStatusCallback(() => {}); // Clear callback
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
    // Since we're in Firestore, 'clearing' means resolving all active ones
    // Or we just ignore this for now, since it was just a local debug tool
    events.forEach(e => {
      EventRepository.updateEventStatus(e.id, 'resolved', 'Cleared manually').catch(console.error);
    });
  }, [events]);

  const resolveEvent = useCallback((id: string, notes?: string) => {
    EventRepository.updateEventStatus(id, 'resolved', notes).catch(console.error);
  }, []);

  return { 
    events, 
    isSimulating,
    matchStatus,
    pause,
    resume,
    generateEvent,
    clearEvents,
    resolveEvent
  };
}
