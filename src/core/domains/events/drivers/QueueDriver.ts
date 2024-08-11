import WorkerModelFactory from '@src/core/domains/events/factory/WorkerModelFactory';
import { IEvent } from '@src/core/domains/events/interfaces/IEvent';
import IEventDriver from '@src/core/domains/events/interfaces/IEventDriver';

export type QueueDriverOptions = {
    queueName: string;
    eventName?: string,
    retries: number,
    collection: string,
    failedCollection: string,
    runAfterSeconds: number;
}

export default class QueueDriver implements IEventDriver
{
    /**
     * Add the worker data to MongoDB
     * 
     * @param event
     * @param options 
     */
    async handle(event: IEvent, options: QueueDriverOptions) 
    {
        const workerModel = (new WorkerModelFactory).create(options.collection, {
            queueName: options.queueName,
            eventName: event.name,
            payload: JSON.stringify(event.payload),
            retries: options.retries
        })

        await workerModel.save();
    }
}