import { IUserData } from "@src/app/models/auth/User";
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";

export default class UserRegisteredEvent extends BaseEvent {

    static readonly eventName = 'UserRegisteredEvent';
    
    protected namespace: string = 'auth';

    constructor(payload) {
        super(payload, SyncDriver);
    }

    getName(): string {
        return UserRegisteredEvent.eventName;
    }

    getQueueName(): string {
        return 'default';
    }

    async execute(payload: IUserData): Promise<void> {
        console.log('User was registered', payload);
    }

}