import WorkerModelFactory from '@src/core/domains/events/factory/WorkerModelFactory';
import { IEvent } from '@src/core/domains/events/interfaces/IEvent';
import IEventDriver from '@src/core/domains/events/interfaces/IEventDriver';
import { ModelConstructor } from '@src/core/interfaces/IModel';
import WorkerModel from '../models/WorkerModel';

export type WorkerModelCtor = ModelConstructor<WorkerModel>

export type QueueDriverOptions<WMCtor extends WorkerModelCtor = WorkerModelCtor> = {
    queueName: string;
    eventName?: string,
    retries: number,
    failedCollection: string,
    runAfterSeconds: number;
    workerModelCtor: WMCtor;
    runOnce?: boolean;
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
        const workerModel = (new WorkerModelFactory).create(new options.workerModelCtor().collection, {
            queueName: options.queueName,
            eventName: event.name,
            payload: JSON.stringify(event.payload),
            retries: options.retries,
            workerModelCtor: options.workerModelCtor
        })

        await workerModel.save();
    }
}