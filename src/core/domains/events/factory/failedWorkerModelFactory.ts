import FailedWorkerModel, { initialFailedWorkerModalData } from "@src/core/domains/events/models/FailedWorkerModel";

type Params = {
    eventName: string;
    payload: any,
    error: any;
}
export default class FailedWorkerModelFactory {
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