
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";

class TestEventQueueCalledFromWorkerEvent extends BaseEvent {

    protected namespace: string = 'testing';

    static readonly eventName = 'TestEventQueueCalledFromWorkerEvent';

    constructor(payload: IEventPayload) {
        super(payload, SyncDriver)
    }

    getName(): string {
        return TestEventQueueCalledFromWorkerEvent.eventName;
    }

}
 
export default TestEventQueueCalledFromWorkerEvent