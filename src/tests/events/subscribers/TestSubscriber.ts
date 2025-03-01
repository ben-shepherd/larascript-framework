import BaseEventSubscriber from "@src/core/domains/events/base/BaseEventSubciber";
import EventRegistry from "@src/core/domains/events/registry/EventRegistry";
import TestEventSyncEvent from "@src/tests/events/events/TestEventSyncEvent";


class TestSubscriber extends BaseEventSubscriber {

    async execute(): Promise<void> {
        console.log('Executed TestSubscriber', this.getPayload(), this.getName())

        this.getEventService().dispatch(new TestEventSyncEvent(this.getPayload() as { hello: string }));
    }

}

export default EventRegistry.register(TestSubscriber)