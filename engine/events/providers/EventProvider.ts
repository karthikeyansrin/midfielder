import { StadiumEvent } from '../../../domain/events/StadiumEvent';

/**
 * Interface representing a source of events for the EventEngine.
 * Allows for a clean architecture where multiple providers (e.g., simulators,
 * IoT sensors, manual entry, external APIs) can feed events into the engine.
 */
export interface EventProvider {
  /**
   * Unique name of the provider.
   */
  readonly name: string;

  /**
   * Starts the provider. The provider should call onEventPublished whenever
   * it generates or receives a new event.
   * 
   * @param onEventPublished Callback function to be executed when a new event occurs.
   */
  start(onEventPublished: (event: StadiumEvent) => void): void;

  /**
   * Stops the provider and cleans up any resources or listeners.
   */
  stop(): void;
}
