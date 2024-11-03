import { TFailedWorkerModelData } from "@src/core/domains/events/interfaces/IEventWorkerConcern";
import FailedWorkerModel from "@src/core/domains/events/models/FailedWorkerModel";

export default class TestFailedWorkerModel extends FailedWorkerModel {

    constructor(data: TFailedWorkerModelData | null = null) {
        super(data ?? {} as TFailedWorkerModelData)
        this.table = 'testsWorkerFailed'
    }

}