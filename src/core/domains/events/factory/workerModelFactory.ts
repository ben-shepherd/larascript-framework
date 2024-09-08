import WorkerModel, { initialWorkerModalData } from "@src/core/domains/events/models/WorkerModel";
import { ModelConstructor } from "@src/core/interfaces/IModel";

type Params = {
    queueName: string;
    eventName: string;
    payload: any,
    retries: number,
    workerModelCtor: ModelConstructor<WorkerModel>
}
export default class WorkerModelFactory {

    create(collection: string, { queueName, eventName, payload, retries, workerModelCtor }: Params): WorkerModel {
        return new workerModelCtor({
            ...initialWorkerModalData,
            queueName,
            eventName,
            payload,
            retries,
            createdAt: new Date()
        }, collection)
    }

}