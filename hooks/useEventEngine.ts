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

// --- Shared State & Deduplication ---
let cachedEvents: StadiumEvent[] = [];
const eventListeners = new Set<(events: StadiumEvent[]) => void>();
let unsubscribeFromFirestore: (() => void) | null = null;

function subscribeToSharedEvents(callback: (events: StadiumEvent[]) => void) {
  eventListeners.add(callback);
  callback(cachedEvents);

  if (!unsubscribeFromFirestore) {
    unsubscribeFromFirestore = EventRepository.subscribeToActiveEvents((newEvents) => {
      cachedEvents = newEvents;
      eventListeners.forEach(listener => listener(newEvents));
    });
  }

  return () => {
    eventListeners.delete(callback);
    if (eventListeners.size === 0 && unsubscribeFromFirestore) {
      unsubscribeFromFirestore();
      unsubscribeFromFirestore = null;
    }
  };
}

let currentMatchStatus: string = simulator.matchStatus;
const statusListeners = new Set<(status: string) => void>();

simulator.setMatchStatusCallback((status) => {
  currentMatchStatus = status;
  statusListeners.forEach(l => l(status));
});
// ------------------------------------

export function useEventEngine() {
  const [events, setEvents] = useState<StadiumEvent[]>(cachedEvents);
  // We need to force a re-render when simulation state changes
  const [isSimulating, setIsSimulating] = useState(!simulator.isPaused);
  const [matchStatus, setMatchStatus] = useState<string>(currentMatchStatus);

  useEffect(() => {
    const handleEvents = (newEvents: StadiumEvent[]) => setEvents(newEvents);
    const handleStatus = (status: string) => setMatchStatus(status);
    
    const unsubscribeEvents = subscribeToSharedEvents(handleEvents);
    statusListeners.add(handleStatus);

    return () => {
      unsubscribeEvents();
      statusListeners.delete(handleStatus);
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
