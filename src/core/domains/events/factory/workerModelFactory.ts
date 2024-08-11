import WorkerModel, { initialWorkerModalData } from "@src/core/domains/Events/models/WorkerModel";

type Params = {
    queueName: string;
    eventName: string;
    payload: any,
    retries: number
}
export default class WorkerModelFactory {
    create(collection: string, { queueName, eventName, payload, retries }: Params): WorkerModel {
        return new WorkerModel({
            ...initialWorkerModalData,
            queueName,
            eventName,
            payload,
            retries,
            createdAt: new Date()
        }, collection)
    }
}