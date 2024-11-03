import { TWorkerModelData } from "@src/core/domains/events/interfaces/IEventWorkerConcern";
import WorkerModel from "@src/core/domains/events/models/WorkerModel";

export default class TestWorkerModel extends WorkerModel {

    constructor(data: TWorkerModelData | null = null) {
        super(data ?? {} as TWorkerModelData)
        this.table = 'testsWorker'
    }

}