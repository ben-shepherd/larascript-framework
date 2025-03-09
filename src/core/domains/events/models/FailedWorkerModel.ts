import { FailedWorkerModelAttributes } from "@src/core/domains/events/interfaces/IEventWorkerConcern";
import Model from "@src/core/domains/models/base/Model";


export interface FailedWorkerModelData extends FailedWorkerModelAttributes {}

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

