import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import TestEventSyncEvent from "@src/tests/events/events/TestEventSyncEvent";


class TestSubscriber extends BaseEvent {

    async execute(...args: any[]): Promise<void> {
        console.log('Executed TestSubscriber', this.getPayload(), this.getName(), {args})

        this.getEventService().dispatch(new TestEventSyncEvent(this.getPayload()));
    }

}

export default TestSubscriber