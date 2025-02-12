import BaseEventSubscriber from "@src/core/domains/events/base/BaseEventSubciber";
import TestEventSyncEvent from "@src/tests/events/events/TestEventSyncEvent";


class TestSubscriber extends BaseEventSubscriber {

    async execute(): Promise<void> {
        console.log('Executed TestSubscriber', this.getPayload(), this.getName())

        this.getEventService().dispatch(new TestEventSyncEvent(this.getPayload()));
    }

}

export default TestSubscriber