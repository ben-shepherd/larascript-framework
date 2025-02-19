
import BaseEvent from "@src/core/domains/events/base/BaseEvent";


class TestEventSyncEvent extends BaseEvent<{hello: string}> {

    static readonly eventName = 'TestEventSyncEvent';

    protected namespace: string = 'testing'; 
    
    async execute(): Promise<void> {
        console.log('Executed TestEventSyncEvent', this.getPayload(), this.getName())
    }

}

export default TestEventSyncEvent