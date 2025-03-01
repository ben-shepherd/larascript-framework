
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import EventRegistry from "@src/core/domains/events/registry/EventRegistry";


class TestEventSyncEvent extends BaseEvent<{hello: string}> {

    static readonly eventName = 'TestEventSyncEvent';

    protected namespace: string = 'testing'; 
    
    async execute(): Promise<void> {
        console.log('Executed TestEventSyncEvent', this.getPayload(), this.getName())
    }

}

export default EventRegistry.register(TestEventSyncEvent)