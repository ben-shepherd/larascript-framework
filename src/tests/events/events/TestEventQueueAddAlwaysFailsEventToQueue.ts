
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import QueueableDriver from "@src/core/domains/events/drivers/QueableDriver";
import { App } from "@src/core/services/App";
import TestEventQueueAlwaysFailsEvent from "@src/tests/events/events/TestEventQueueAlwaysFailsEvent";


class TestEventQueueAddAlwaysFailsEventToQueue extends BaseEvent {

    protected namespace: string = 'testing';

    static readonly eventName = 'TestEventQueueAddAlwaysFailsEventToQueue';

    constructor() {
        super(null, QueueableDriver)
    }

    getQueueName(): string {
        return 'testQueue';
    }

    getName(): string {
        return TestEventQueueAddAlwaysFailsEventToQueue.eventName;
    }

    async execute(): Promise<void> {
        console.log('Executed TestEventQueueAddAlwaysFailsEventToQueue', this.getPayload(), this.getName())

        await App.container('events').dispatch(new TestEventQueueAlwaysFailsEvent())
    }

}

export default TestEventQueueAddAlwaysFailsEventToQueue