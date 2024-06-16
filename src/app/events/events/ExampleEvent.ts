import Event from "@src/core/domains/events/services/Event";

type Payload = {
    userId: string;
}

export default class ExampleEvent extends Event<Payload> {

    constructor(payload: Payload) {
        super('OnExample', 'queue', payload)
    }
}