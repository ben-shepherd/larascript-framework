
import { TCasts } from "@src/core/domains/cast/interfaces/IHasCastableConcern";
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";
import EventRegistry from "@src/core/domains/events/registry/EventRegistry";

class TestEventQueueCalledFromWorkerEvent extends BaseEvent {

    protected namespace: string = 'testing';

    casts: TCasts = {
        createdAt: "date"
    }

    constructor(payload) {
        super(payload, SyncDriver)
    }

}
 
export default EventRegistry.register(TestEventQueueCalledFromWorkerEvent)