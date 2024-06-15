import Event from "@src/core/events/Event";

type Payload = {
    userId: string;
}

export default class ExampleEvent extends Event<Payload> {

    name = 'OnExample'

    constructor(payload: Payload) {
        super(payload)
    }
}