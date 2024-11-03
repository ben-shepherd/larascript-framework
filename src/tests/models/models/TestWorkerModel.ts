import WorkerLegacyModel, { WorkerModelData } from "@src/core/domains/events-legacy/models/WorkerLegacyModel";

export default class TestWorkerModel extends WorkerLegacyModel {

    constructor(data: WorkerModelData | null = null) {
        super(data ?? {} as WorkerModelData)
        this.table = 'testsWorker'
    }

}