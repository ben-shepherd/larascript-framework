import BaseEventListener from "@src/core/domains/events/base/BaseEventListener";
 
export class TestUserCreatedListener extends BaseEventListener {

    protected namespace: string = 'testing';
     
    async execute(): Promise<void> {
        console.log('Executed TestUserCreatedListener', this.getPayload(), this.getName())
    }

}