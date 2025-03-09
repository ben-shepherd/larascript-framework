
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import EventRegistry from "@src/core/domains/events/registry/EventRegistry";


class TestEventSyncBadPayloadEvent extends BaseEvent {

    protected namespace: string = 'testing';

    constructor(payload) {
        super(payload);
    }

    async execute(): Promise<void> {
        console.log('Executed TestEventSyncBadPayloadEvent', this.getPayload(), this.getName())
    }

    getName(): string {
        return 'TestEventSyncBadPayloadEvent'
    }

}

export default EventRegistry.register(TestEventSyncBadPayloadEvent)