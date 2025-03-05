import BaseEventListener from "@src/core/domains/events/base/BaseEventListener";
import EventRegistry from "@src/core/domains/events/registry/EventRegistry";

class TestUserCreatedListener extends BaseEventListener {

    protected namespace: string = 'testing';
     
    async execute(): Promise<void> {
        console.log('Executed TestUserCreatedListener', this.getPayload(), this.getName())
    }

}

export default EventRegistry.registerListener(TestUserCreatedListener)