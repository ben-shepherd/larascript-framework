
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";
import { TCasts } from "@src/core/interfaces/concerns/IHasCastableConcern";

class TestEventQueueCalledFromWorkerEvent extends BaseEvent {

    protected namespace: string = 'testing';

    static readonly eventName = 'TestEventQueueCalledFromWorkerEvent';

    casts: TCasts = {
        createdAt: "date"
    }

    constructor(payload) {
        super(payload, SyncDriver)
    }

    getName(): string {
        return TestEventQueueCalledFromWorkerEvent.eventName;
    }

}
 
export default TestEventQueueCalledFromWorkerEvent