import Model from "@src/core/base/Model";
import IModelData from "@src/core/interfaces/IModelData";

/**
 * Represents a failed worker model.
 *
 * @interface FailedWorkerModelData
 * @extends IModelData
 */
export interface FailedWorkerModelData extends IModelData {

    /**
     * The name of the event that failed.
     */
    eventName: string;

    /**
     * The payload of the event that failed.
     */
    payload: any;

    /**
     * The error that caused the event to fail.
     */
    error: any;

    /**
     * The date when the event failed.
     */
    failedAt: Date;
}

/**
 * Initial data for a failed worker model.
 */
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
        super(data);
    }

}

