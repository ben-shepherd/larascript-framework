
import BaseEvent from "@src/core/domains/events/base/BaseEvent";


class TestEventQueueAlwaysFailsEvent extends BaseEvent {

    protected namespace: string = 'testing';

    static readonly eventName = 'TestEventQueueAlwaysFailsEvent';

    getQueueName(): string {
        return 'testQueue';
    }

    getName(): string {
        return TestEventQueueAlwaysFailsEvent.eventName;
    }

    async execute(...args: any[]): Promise<void> {
        console.log('Executed TestEventQueueAlwaysFailsEvent', this.getPayload(), this.getName(), {args})
        throw new Error('Always fails');
    }

}

export default TestEventQueueAlwaysFailsEvent