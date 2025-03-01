
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import QueueableDriver from "@src/core/domains/events/drivers/QueableDriver";
import EventRegistry from "@src/core/domains/events/registry/EventRegistry";
import { events } from "@src/core/domains/events/services/EventService";
import TestEventQueueCalledFromWorkerEvent from "@src/tests/events/events/TestEventQueueCalledFromWorkerEvent";

class TestEventQueueEvent extends BaseEvent {

    protected namespace: string = 'testing';

    static readonly eventName = 'TestEventQueueEvent';

    constructor(payload) {
        super(payload, QueueableDriver)
    }

    getQueueName(): string {
        return 'testQueue';
    }

    getName(): string {
        return TestEventQueueEvent.eventName;
    }

    async execute(): Promise<void> {
        console.log('Executed TestEventQueueEvent', this.getPayload(), this.getName())
        events().dispatch(new TestEventQueueCalledFromWorkerEvent(this.getPayload()))
    }

}

export default EventRegistry.register(TestEventQueueEvent)