import WorkerModelFactory from '@src/core/domains/events-legacy/factory/workerModelFactory';
import { IEvent } from '@src/core/domains/events-legacy/interfaces/IEvent';
import IEventDriver from '@src/core/domains/events-legacy/interfaces/IEventDriver';
import WorkerLegacyModel from '@src/core/domains/events-legacy/models/WorkerLegacyModel';
import { ModelConstructor } from '@src/core/interfaces/IModel';

/**
 * QueueDriver
 *
 * Saves events for background processing
 */
export type WorkerModelCtor = ModelConstructor<WorkerLegacyModel>

export type QueueDriverOptions<WMCtor extends WorkerModelCtor = WorkerModelCtor> = {

    /**
     * Name of the queue
     */
    queueName: string;

    /**
     * Name of the event, defaults to the IEvent.name
     */
    eventName?: string;

    /**
     * Number of retry attempts for failed events
     */
    retries: number;

    /**
     * Collection to store failed events
     */
    failedCollection: string;

    /**
     * Delay before processing queued events
     */
    runAfterSeconds: number;

    /**
     * Constructor for the Worker model
     */
    workerModelCtor: WMCtor;

    /**
     * Run the worker only once, defaults to false
     */
    runOnce?: boolean;
}

export default class QueueDriver implements IEventDriver {

    /**
     * Handle the dispatched event
     * @param event
     * @param options
     */
    async handle(event: IEvent, options: QueueDriverOptions) {
        const workerModel = (new WorkerModelFactory).create(new options.workerModelCtor().table, {
            queueName: options.queueName,
            eventName: event.name,
            payload: JSON.stringify(event.payload),
            retries: options.retries,
            workerModelCtor: options.workerModelCtor
        });

        await workerModel.save();
    }

}
