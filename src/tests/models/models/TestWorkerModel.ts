import WorkerModel, { WorkerModelData } from "@src/core/domains/events/models/WorkerModel";

export default class TestWorkerModel extends WorkerModel {

    constructor(data: WorkerModelData | null = null) {
        super(data ?? {} as WorkerModelData)
        this.table = 'testsWorker'
    }

}