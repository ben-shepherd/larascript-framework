import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";

export default class UserCreatedSubscriber extends BaseEvent {

    static readonly eventName = 'UserCreatedSubscriber';
    
    protected namespace: string = 'auth';

    constructor(payload) {
        super(payload, SyncDriver);
    }

    getName(): string {
        return UserCreatedSubscriber.eventName;
    }

    getQueueName(): string {
        return 'default';
    }

    async execute(): Promise<void> {
        // const payload = this.getPayload<IUserData>();
        
        // Handle logic
    }

}