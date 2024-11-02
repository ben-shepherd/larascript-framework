import BaseEventListener from "@src/core/domains/events/base/BaseEventListener";

class TestListener extends BaseEventListener {
    
    async execute(...args: any[]): Promise<void> {
        console.log('Executed TestListener', this.getPayload(), this.getName());
    }

}

export default TestListener