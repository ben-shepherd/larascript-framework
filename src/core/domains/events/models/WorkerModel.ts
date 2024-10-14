import Model from "@src/core/base/Model";
import IModelAttributes from "@src/core/interfaces/IModelData";

export interface WorkerModelData extends IModelAttributes {
    queueName: string;
    eventName: string;
    payload: any;
    attempt: number;
    retries: number;
    createdAt: Date;
}

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
export default class WorkerModel extends Model<WorkerModelData> {


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
        super(data); 
    }

    public getPayload(): unknown {
        try {
            const payload = this.getAttribute('payload');
            return JSON.parse(payload)
        }
        // eslint-disable-next-line no-unused-vars
        catch (err) {
            return null
        }
    }

}