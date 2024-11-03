import QueueableDriver, { TQueueDriverOptions } from "@src/core/domains/events/drivers/QueableDriver";
import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";
import { IEventConfig } from "@src/core/domains/events/interfaces/config/IEventConfig";
import FailedWorkerModel from "@src/core/domains/events/models/FailedWorkerModel";
import WorkerModel from "@src/core/domains/events/models/WorkerModel";
import EventService from "@src/core/domains/events/services/EventService";
import TestEventQueueEvent from "@src/tests/events/events/TestEventQueueEvent";
import TestEventSyncEvent from "@src/tests/events/events/TestEventSyncEvent";
import TestListener from "@src/tests/events/listeners/TestListener";
import TestSubscriber from "@src/tests/events/subscribers/TestSubscriber";

/**
 * Event Drivers Constants
 */
export const EVENT_DRIVERS = {
    SYNC: 'sync',
    QUEABLE: 'queueable'
}

export const eventConfig: IEventConfig = {

    /**
     * Default Event Driver
     */
    defaultDriver: SyncDriver,

    /**
     * Event Drivers Configuration
     * 
     * This object defines the available event drivers and their configurations.
     * Each driver can have its own set of options to customize its behavior.
     */
    drivers: {

        // Synchronous Driver: Processes events immediately
        [EVENT_DRIVERS.SYNC]: EventService.createConfig(SyncDriver, {}),
    
        // Queue Driver: Saves events for background processing
        [EVENT_DRIVERS.QUEABLE]: EventService.createConfig<TQueueDriverOptions>(QueueableDriver, {
            queueName: 'default',                    // Name of the queue
            retries: 3,                              // Number of retry attempts for failed events
            runAfterSeconds: 10,                     // Delay before processing queued events
            workerModelCtor: WorkerModel,            // Constructor for the Worker model
            failedWorkerModelCtor: FailedWorkerModel,
        })
        
    },

    events: EventService.createEvents([
        TestEventQueueEvent,
        TestEventSyncEvent
    ]),

    /**
     * Event Listeners Configuration
     */
    listeners: EventService.createListeners([
        {
            listener: TestListener,
            subscribers: [
                TestSubscriber 
            ]
        }
    ]),

}