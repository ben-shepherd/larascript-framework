import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import TestEventSyncEvent from "@src/tests/events/events/TestEventSyncEvent";


class TestSubscriber extends BaseEvent {

    async execute(): Promise<void> {
        console.log('Executed TestSubscriber', this.getPayload(), this.getName())

        this.getEventService().dispatch(new TestEventSyncEvent(this.getPayload()));
    }

}

export default TestSubscriber