import { UserAttributes } from "@src/app/models/auth/User";
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";

export default class TestUserCreatedSubscriber extends BaseEvent {

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
        const payload = this.getPayload<UserAttributes>();
        
        console.log('User was created', payload);
    }

}