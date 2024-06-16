import Model from "@src/core/base/Model";
import { ObjectId } from "mongodb";

export interface FailedWorkerModelData {
    _id?: ObjectId;
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

    constructor(data: FailedWorkerModelData, collection: string) {
        super(data)
        this.collection = collection
    }
}