import WorkerModelFactory from '../factory/workerModelFactory';
import { IEvent } from '../interfaces/IEvent';
import IEventDriver from '../interfaces/IEventDriver';

export type QueueDriverOptions = {
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
    async handle(event: IEvent, options: QueueDriverOptions) {

        const workerModel = (new WorkerModelFactory).create(options.collection, {
            eventName: event.name,
            payload: JSON.stringify(event.payload),
            retries: options.retries
        })

        await workerModel.save();
    }
}