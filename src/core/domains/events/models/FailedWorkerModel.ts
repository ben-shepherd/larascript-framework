import Model from "@src/core/base/Model";

import { TFailedWorkerModelData } from "../interfaces/IEventWorkerConcern";


export interface FailedWorkerModelData extends TFailedWorkerModelData {}

export const initialFailedWorkerModalData = {
    eventName: '',
    payload: null,
    error: null,
    failedAt: new Date()
};

/**
 * FailedWorkerModel class.
 *
 * @class FailedWorkerModel
 * @extends Model<FailedWorkerModelData>
 */
export default class FailedWorkerModel extends Model<FailedWorkerModelData> {

    /**
     * Dates fields.
     */
    dates = ['failedAt'];

    /**
     * Fields of the model.
     */
    fields = [
        'eventName',
        'payload',
        'error',
        'failedAt'
    ];

    /**
     * Constructor.
     *
     * @param {FailedWorkerModelData} data - The data for the model.
     */
    constructor(data: FailedWorkerModelData) {
        super({ ...initialFailedWorkerModalData, ...data });
    }

}

