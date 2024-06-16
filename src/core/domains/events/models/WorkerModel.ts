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
        'payload',
        'attempt',
        'retries',
        'createdAt'
    ]

    constructor(data: WorkerModelData, collection: string) {
        super(data);
        this.collection = collection; 
    }

    public getPayload(): any | null {
        try {
            const payload = this.getAttribute('payload');
            return JSON.parse(payload)
        }
        catch (err) {
            return null
        }
    }
}