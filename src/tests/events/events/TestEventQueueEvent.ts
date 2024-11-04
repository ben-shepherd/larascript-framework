
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import QueueableDriver from "@src/core/domains/events/drivers/QueableDriver";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";
import { App } from "@src/core/services/App";
import TestEventQueueCalledFromWorkerEvent from "@src/tests/events/events/TestEventQueueCalledFromWorkerEvent";

class TestEventQueueEvent extends BaseEvent {

    protected namespace: string = 'testing';

    static readonly eventName = 'TestEventQueueEvent';

    constructor(payload: IEventPayload) {
        super(payload, QueueableDriver)
    }

    getQueueName(): string {
        return 'testQueue';
    }

    getName(): string {
        return TestEventQueueEvent.eventName;
    }

    async execute(...args: any[]): Promise<void> {
        console.log('Executed TestEventQueueEvent', this.getPayload(), this.getName(), {args})

        App.container('events').dispatch(new TestEventQueueCalledFromWorkerEvent(this.getPayload()))
    }

}

export default TestEventQueueEvent