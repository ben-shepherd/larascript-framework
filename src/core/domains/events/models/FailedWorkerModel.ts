import Model from "@src/core/base/Model";
import { ObjectId } from "mongodb";

export interface FailedWorkerModelData {
    _id?: ObjectId;
    name: string;
    error: string;
    failedAt: Date
}

export const initialFailedWorkerModalData = {
    name: '',
    error: '',
    failedAt: new Date()
}

export default class FailedWorkerModel extends Model<FailedWorkerModelData> {
    dates = ['failedAt']

    fields = [
        'name',
        'error'
    ]

    constructor(collection: string, data: FailedWorkerModelData) {
        super(data)
        this.collection = collection
    }
}