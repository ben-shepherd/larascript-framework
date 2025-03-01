import { FailedWorkerModelAttributes } from "@src/core/domains/events/interfaces/IEventWorkerConcern";
import FailedWorkerModel from "@src/core/domains/events/models/FailedWorkerModel";

export default class TestFailedWorkerModel extends FailedWorkerModel {

    public table: string = 'testsWorkerFailed'

    constructor(data: FailedWorkerModelAttributes | null = null) {
        super(data ?? {} as FailedWorkerModelAttributes)
    }

}