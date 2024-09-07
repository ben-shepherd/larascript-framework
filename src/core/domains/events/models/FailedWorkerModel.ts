import Model from "@src/core/base/Model";
import IModelData from "@src/core/interfaces/IModelData";

export interface FailedWorkerModelData extends IModelData {
    eventName: string;
    payload: any;
    error: any;
    failedAt: Date
}

export const initialFailedWorkerModalData = {
    eventName: '',
    payload: null,
    error: null,
    failedAt: new Date()
}

export default class FailedWorkerModel extends Model<FailedWorkerModelData> {

    dates = ['failedAt']

    fields = [
        'eventName',
        'payload',
        'error',
        'failedAt'
    ]

    constructor(data: FailedWorkerModelData) {
        super(data)
    }

}