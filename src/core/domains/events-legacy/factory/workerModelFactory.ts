import WorkerLegacyModel, { initialWorkerModalData } from "@src/core/domains/events-legacy/models/WorkerLegacyModel";
import { ModelConstructor } from "@src/core/interfaces/IModel";

type Params = {
    queueName: string;
    eventName: string;
    payload: any,
    retries: number,
    workerModelCtor: ModelConstructor<WorkerLegacyModel>
}
export default class WorkerModelFactory {

    /**
     * Creates a new instance of WorkerModel
     * @param collection The database collection to store the model in
     * @param queueName The name of the queue to store the model in
     * @param eventName The name of the event to store the model with
     * @param payload The payload of the event to store the model with
     * @param retries The number of retries for the event to store the model with
     * @param workerModelCtor The constructor for the WorkerModel to create
     * @returns A new instance of WorkerModel
     */
    create(collection: string, { queueName, eventName, payload, retries, workerModelCtor }: Params): WorkerLegacyModel {
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