import UserCreatedListener from "@src/app/events/listeners/UserCreatedListener";
import UserCreatedSubscriber from "@src/app/events/subscribers/UserCreatedSubscriber";
import QueueableDriver, { TQueueDriverOptions } from "@src/core/domains/events/drivers/QueableDriver";
import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";
import { IEventConfig } from "@src/core/domains/events/interfaces/config/IEventConfig";
import FailedWorkerModel from "@src/core/domains/events/models/FailedWorkerModel";
import WorkerModel from "@src/core/domains/events/models/WorkerModel";
import EventService from "@src/core/domains/events/services/EventService";

export const EVENT_DRIVERS = {
    SYNC: EventService.getDriverName(SyncDriver),
    QUEABLE: EventService.getDriverName(QueueableDriver)
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
        [EVENT_DRIVERS.SYNC]: EventService.createConfigDriver(SyncDriver, {}),
    
        // Queue Driver: Saves events for background processing
        [EVENT_DRIVERS.QUEABLE]: EventService.createConfigDriver<TQueueDriverOptions>(QueueableDriver, {
            queueName: 'default',                    // Name of the queue
            retries: 3,                              // Number of retry attempts for failed events
            runAfterSeconds: 10,                     // Delay before processing queued events
            workerModelCtor: WorkerModel,            // Constructor for the Worker model
            failedWorkerModelCtor: FailedWorkerModel,
        })
        
    },

    /**
     * Event Listeners Configuration
     * 
     * This array defines the listeners and their corresponding subscribers.
     * Each listener can have multiple subscribers that will be notified when the listener is triggered.
     */
    listeners: [
        {
            listener: UserCreatedListener,
            subscribers: [
                UserCreatedSubscriber
            ]
        }
    ]
}