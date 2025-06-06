
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import QueueableDriver from "@src/core/domains/events/drivers/QueableDriver";
import EventRegistry from "@src/core/domains/events/registry/EventRegistry";
import { AppSingleton } from "@src/core/services/App";
import TestEventQueueAlwaysFailsEvent from "@src/tests/larascript/events/events/TestEventQueueAlwaysFailsEvent";


class TestEventQueueAddAlwaysFailsEventToQueue extends BaseEvent {

    protected namespace: string = 'testing';

    constructor() {
        super(null, QueueableDriver)
    }

    getQueueName(): string {
        return 'testQueue';
    }

    async execute(): Promise<void> {
        console.log('Executed TestEventQueueAddAlwaysFailsEventToQueue', this.getPayload(), this.getName())

        await AppSingleton.container('events').dispatch(new TestEventQueueAlwaysFailsEvent())
    }

}

export default EventRegistry.register(TestEventQueueAddAlwaysFailsEventToQueue)