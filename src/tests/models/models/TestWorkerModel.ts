import { WorkerModelAttributes } from "@src/core/domains/events/interfaces/IEventWorkerConcern";
import WorkerModel from "@src/core/domains/events/models/WorkerModel";

export default class TestWorkerModel extends WorkerModel {

    constructor(data: WorkerModelAttributes | null = null) {
        super(data ?? {} as WorkerModelAttributes)
        this.table = 'testsWorker'
    }

}