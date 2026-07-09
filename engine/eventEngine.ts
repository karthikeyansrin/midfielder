import { StadiumEvent, EventCategory, EventSeverity, EventStatus } from '../domain/events/StadiumEvent';
import { EventProvider } from './events/providers/EventProvider';

/**
 * EventEngine handles the lifecycle of stadium events.
 * It manages multiple event providers, stores active and resolved events,
 * and provides querying capabilities.
 */
export class EventEngine {
  private events: Map<string, StadiumEvent> = new Map();
  private providers: EventProvider[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {}

  /**
   * Subscribe to changes in the event store.
   * @param listener Callback function that will be called when the store updates.
   * @returns A function to unsubscribe the listener.
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners that the store has changed.
   */
  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Registers a new event provider and starts listening to its events.
   * 
   * @param provider The EventProvider implementation to register.
   */
  public registerProvider(provider: EventProvider): void {
    this.providers.push(provider);
    provider.start((event: StadiumEvent) => this.publishEvent(event));
  }

  /**
   * Retrieves a registered provider by its name.
   */
  public getProvider<T extends EventProvider>(name: string): T | undefined {
    return this.providers.find(p => p.name === name) as T | undefined;
  }

  /**
   * Stops all registered providers.
   */
  public stopAllProviders(): void {
    for (const provider of this.providers) {
      provider.stop();
    }
  }

  /**
   * Publishes a new event into the engine.
   * 
   * @param event The StadiumEvent to publish.
   */
  public publishEvent(event: StadiumEvent): void {
    this.events.set(event.id, event);
    this.notifyListeners();
  }

  /**
   * Retrieves all currently active or investigating events.
   * 
   * @returns An array of active StadiumEvents.
   */
  public getActiveEvents(): StadiumEvent[] {
    return Array.from(this.events.values()).filter(
      (e) => e.status === 'active' || e.status === 'investigating'
    );
  }

  /**
   * Resolves a specific event by its ID.
   * 
   * @param eventId The ID of the event to resolve.
   * @param resolutionNotes Optional notes explaining how it was resolved.
   */
  public resolveEvent(eventId: string, resolutionNotes?: string): void {
    const event = this.events.get(eventId);
    if (event) {
      event.status = 'resolved';
      if (resolutionNotes) {
        event.metadata = {
          ...event.metadata,
          resolutionNotes,
          resolvedAt: new Date().toISOString(),
        };
      }
      this.events.set(eventId, event);
      this.notifyListeners();
    }
  }

  /**
   * Clears all events from the store.
   */
  public clearEvents(): void {
    this.events.clear();
    this.notifyListeners();
  }

  /**
   * Filters all events based on the provided criteria.
   * 
   * @param filters Criteria to filter by (category, severity, status).
   * @returns An array of filtered StadiumEvents.
   */
  public filterEvents(filters: {
    category?: EventCategory;
    severity?: EventSeverity;
    status?: EventStatus;
  }): StadiumEvent[] {
    let filtered = Array.from(this.events.values());

    if (filters.category) {
      filtered = filtered.filter((e) => e.category === filters.category);
    }
    
    if (filters.severity) {
      filtered = filtered.filter((e) => e.severity === filters.severity);
    }

    if (filters.status) {
      filtered = filtered.filter((e) => e.status === filters.status);
    }

    return filtered;
  }
}
