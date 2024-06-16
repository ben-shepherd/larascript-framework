import WorkerModel, { initialWorkerModalData } from "../models/WorkerModel";

type Params = {
    eventName: string;
    payload: any,
    retries: number
}
export default class WorkerModelFactory {
    create(collection: string, { eventName, payload, retries }: Params): WorkerModel {
        return new WorkerModel({
            ...initialWorkerModalData,
            eventName,
            payload,
            retries,
            createdAt: new Date()
        }, collection)
    }
}