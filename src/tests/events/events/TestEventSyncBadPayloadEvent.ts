
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";


class TestEventSyncBadPayloadEvent extends BaseEvent {

    constructor(payload: unknown) {
        super(payload as IEventPayload);
    }

    async execute(): Promise<void> {
        console.log('Executed TestEventSyncBadPayloadEvent', this.getPayload(), this.getName())
    }

    getName(): string {
        return 'TestEventSyncBadPayloadEvent'
    }

}

export default TestEventSyncBadPayloadEvent