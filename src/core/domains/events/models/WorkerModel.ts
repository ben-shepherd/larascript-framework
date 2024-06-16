import Model from "@src/core/base/Model";
import { ObjectId } from "mongodb";

export interface WorkerModelData {
    _id?: ObjectId,
    eventName: string;
    payload: any;
    attempt: number;
    retries: number;
    createdAt: Date;
}

export const initialWorkerModalData = {
    eventName: '',
    payload: null,
    attempt: 0,
    retries: 0,
    createdAt: new Date()
}

export default class WorkerModel extends Model<WorkerModelData> 
{
    dates = ['createdAt']

    fields = [
        'eventName',
        'attempt',
        'retries',
        'createdAt'
    ]

    constructor(collection: string, data: WorkerModelData) {
        super(data);
        this.collection = collection; 
    }
}