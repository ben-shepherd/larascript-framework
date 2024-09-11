import FailedWorkerModel, { initialFailedWorkerModalData } from "@src/core/domains/events/models/FailedWorkerModel";

type Params = {
    eventName: string;
    payload: any,
    error: any;
}
export default class FailedWorkerModelFactory {

    /**
     * Creates a new instance of FailedWorkerModel
     * @param collection The database collection to store the model in
     * @param eventName The name of the event that failed
     * @param payload The payload of the event that failed
     * @param error The error that caused the event to fail
     * @returns A new instance of FailedWorkerModel
     */
    create(collection: string, { eventName, payload, error }: Params): FailedWorkerModel {
        return new FailedWorkerModel({
            ...initialFailedWorkerModalData,
            eventName,
            payload,
            error,
            failedAt: new Date(),
        })
    }

}