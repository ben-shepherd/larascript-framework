import EventSubscriber from "@src/core/domains/events-legacy/services/EventSubscriber";

type Payload = {
    userId: string;
}

export default class ExampleSubscriber extends EventSubscriber<Payload> {
    
    constructor(payload: Payload) {
        const eventName = 'OnExample'
        const driver = 'queue';

        super(eventName, driver, payload)
    }

}