import EventSubscriber from "@src/core/domains/events/services/EventSubscriber";

type Payload = {
    userId: string;
}

export default class ExampleEvent extends EventSubscriber<Payload> {
    
    constructor(payload: Payload) {
        super('OnExample', 'queueOther', payload)
    }
}