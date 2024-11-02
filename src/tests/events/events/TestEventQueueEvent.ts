
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import QueueableDriver from "@src/core/domains/events/drivers/QueableDriver";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";

class TestEventQueueEvent extends BaseEvent {

    static readonly eventName = 'TestEventQueueEvent';

    constructor(payload: IEventPayload) {
        super(payload, QueueableDriver)
    }

    getName(): string {
        return TestEventQueueEvent.eventName;
    }

}

export default TestEventQueueEvent