import BaseEventSubscriber from "@src/core/domains/events/base/BaseEventSubciber";
import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";
import EventRegistry from "@src/core/domains/events/registry/EventRegistry";

class TestUserCreatedSubscriber extends BaseEventSubscriber {

    static readonly eventName = 'TestUserCreatedSubscriber';
    
    protected namespace: string = 'testing';

    constructor(payload) {
        super(payload, SyncDriver);
    }

    getName(): string {
        return TestUserCreatedSubscriber.eventName;
    }

    getQueueName(): string {
        return 'default';
    }

    async execute(): Promise<void> {
        const payload = this.getPayload();
        
        console.log('User was created', payload);
    }

}

export default EventRegistry.registerSubscriber(TestUserCreatedSubscriber)