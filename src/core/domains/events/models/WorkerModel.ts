import { IWorkerModel, WorkerModelAttributes } from "@src/core/domains/events/interfaces/IEventWorkerConcern";
import Model from "@src/core/models/base/Model";

export interface WorkerModelData extends WorkerModelAttributes {}

export const initialWorkerModalData = {
    queueName: '',
    eventName: '',
    payload: null,
    attempt: 0,
    retries: 0,
    createdAt: new Date()
}

/**
 * WorkerModel class.
 *
 * Represents a worker model that stores data for a background job.
 *
 * @class WorkerModel
 * @extends Model<WorkerModelData>
 */
export default class WorkerModel extends Model<WorkerModelData> implements IWorkerModel {

    table: string = 'worker_queue';

    /**
     * The list of date fields.
     *
     * @type {string[]}
     */
    dates = ['createdAt']

    /**
     * The list of fields.
     *
     * @type {string[]}
     */
    fields = [
        'queueName',
        'eventName',
        'payload',
        'attempt',
        'retries',
        'createdAt'
    ]

    /**
     * The list of fields that are JSON.
     *
     * @type {string[]}
     */
    json = [
        'payload'
    ]

    constructor(data: WorkerModelData) {
        super({...initialWorkerModalData, ...data}); 
    }

    getPayload<T = unknown>(): T | null {
        try {
            const payload = this.getAttributeSync('payload');
            return JSON.parse(payload) as T
        }
        // eslint-disable-next-line no-unused-vars
        catch (err) {
            return null
        }
    }

}