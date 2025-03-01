import BaseEventListener from "@src/core/domains/events/base/BaseEventListener";
import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";
import EventRegistry from "@src/core/domains/events/registry/EventRegistry";

class TestListener extends BaseEventListener {

    constructor(payload: { hello: string }) {
        super(payload, SyncDriver);
    }
    
     
    async execute(): Promise<void> {
        console.log('Executed TestListener', this.getPayload(), this.getName());
    }

}

export default EventRegistry.register(TestListener)