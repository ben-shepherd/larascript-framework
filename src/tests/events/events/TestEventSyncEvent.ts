
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";


class TestEventSyncEvent extends BaseEvent {

    static readonly eventName = 'TestEventSyncEvent';

    protected namespace: string = 'testing';

    constructor(payload: IEventPayload) {
        super(payload);
    }

    async execute(): Promise<void> {
        console.log('Executed TestEventSyncEvent', this.getPayload(), this.getName())
    }

}

export default TestEventSyncEvent