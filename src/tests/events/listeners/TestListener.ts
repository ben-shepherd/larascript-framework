import BaseEventListener from "@src/core/domains/events/base/BaseEventListener";
import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";

class TestListener extends BaseEventListener {

    constructor(payload: { hello: string }) {
        super(payload, SyncDriver);
    }
    
    // eslint-disable-next-line no-unused-vars
    async execute(...args: any[]): Promise<void> {
        console.log('Executed TestListener', this.getPayload(), this.getName());
    }

}

export default TestListener