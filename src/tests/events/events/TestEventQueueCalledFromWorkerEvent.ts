
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";

class TestEventQueueCalledFromWorkerEvent extends BaseEvent {

    protected namespace: string = 'testing';

    static readonly eventName = 'TestEventQueueCalledFromWorkerEvent';

    constructor(payload) {
        super(payload, SyncDriver)
    }

    getName(): string {
        return TestEventQueueCalledFromWorkerEvent.eventName;
    }

}
 
export default TestEventQueueCalledFromWorkerEvent