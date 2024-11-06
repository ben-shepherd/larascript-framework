import BaseEventListener from "@src/core/domains/events/base/BaseEventListener";
 
export class TestUserCreatedListener extends BaseEventListener {

    static readonly eventName = 'TestUserCreatedListener';

    protected namespace: string = 'testing';
     
    async execute(): Promise<void> {
        console.log('Executed TestUserCreatedListener', this.getPayload(), this.getName())
    }

    getName(): string {
        return TestUserCreatedListener.eventName
    }

}