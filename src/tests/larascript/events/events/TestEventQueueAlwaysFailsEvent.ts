
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import EventRegistry from "@src/core/domains/events/registry/EventRegistry";


class TestEventQueueAlwaysFailsEvent extends BaseEvent {

    protected namespace: string = 'testing';

    static readonly eventName = 'TestEventQueueAlwaysFailsEvent';

    getQueueName(): string {
        return 'testQueue';
    }

    getName(): string {
        return TestEventQueueAlwaysFailsEvent.eventName;
    }

    async execute(): Promise<void> {
        console.log('Executed TestEventQueueAlwaysFailsEvent', this.getPayload(), this.getName())
        throw new Error('Always fails');
    }

}

export default EventRegistry.register(TestEventQueueAlwaysFailsEvent)