import { ExampleListener } from "@src/app/events/listeners/ExampleListener";
import QueueDriver, { QueueDriverOptions } from "@src/core/domains/events-legacy/drivers/QueueDriver";
import SynchronousDriver from "@src/core/domains/events-legacy/drivers/SynchronousDriver";
import { IEventDrivers, ISubscribers } from "@src/core/domains/events-legacy/interfaces/IEventConfig";
import WorkerLegacyModel from "@src/core/domains/events-legacy/models/WorkerLegacyModel";
import DriverOptions from "@src/core/domains/events-legacy/services/QueueDriverOptions";

/**
 * Default Event Driver Configuration
 * 
 * This setting determines which event driver will be used by default when no specific
 * driver is defined for an event. The value is read from the APP_EVENT_DRIVER
 * environment variable, falling back to 'sync' if not set.
 * 
 * Options:
 * - 'sync': Events are processed immediately.
 * - 'queue': Events are queued for background processing.
 */
export const defaultEventDriver: string = process.env.APP_EVENT_DRIVER ?? 'sync';

/**
 * Event Drivers Configuration
 * 
 * This object defines the available event drivers and their configurations.
 * Each driver can have its own set of options to customize its behavior.
 * 
 * Structure:
 * {
 *   [driverName: string]: {
 *     driver: Class extending IEventDriver,
 *     options?: DriverOptions object
 *   }
 * }
 */
export const eventDrivers: IEventDrivers = {
    // Synchronous Driver: Processes events immediately
    sync: {
        driverCtor: SynchronousDriver
    },
    // Queue Driver: Saves events for background processing
    queue: {
        driverCtor: QueueDriver,
        options: new DriverOptions<QueueDriverOptions>({
            queueName: 'default',     // Name of the queue
            retries: 3,               // Number of retry attempts for failed events
            failedCollection: 'failedWorkers',  // Collection to store failed events
            runAfterSeconds: 10,      // Delay before processing queued events
            workerModelCtor: WorkerLegacyModel  // Constructor for the Worker model
        })
    }
} as const;

/**
 * Event Subscribers Configuration
 * 
 * This object maps event names to arrays of listener classes. When an event
 * is dispatched, all listeners registered for that event will be executed.
 * 
 * Structure:
 * {
 *   [eventName: string]: Array<ListenerClass>
 * }
 * 
 * Example usage:
 * When an 'OnExample' event is dispatched, the ExampleListener will be triggered.
 */
export const eventSubscribers: ISubscribers = {
    'OnExample': [
        ExampleListener
    ]   
}