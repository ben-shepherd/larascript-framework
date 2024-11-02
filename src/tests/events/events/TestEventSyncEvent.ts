
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";


class TestEventSyncEvent extends BaseEvent {

    static readonly eventName = 'TestEventSyncEvent';

    constructor(payload: IEventPayload) {
        super(SyncDriver, payload);
    }

    async execute(): Promise<void> {
        console.log('Executed TestEventSyncEvent', this.getPayload(), this.getName())
    }

}

export default TestEventSyncEvent