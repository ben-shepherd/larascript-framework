import { EVENT_DRIVERS } from "@src/config/events";
import BaseDriver from "@src/core/domains/events/base/BaseDriver";

class QueueableDriver extends BaseDriver  {

    async dispatch(): Promise<void> {
        // todo save event to queue
    }

    getName(): string {
        return EVENT_DRIVERS.QUEABLE;
    }

}

export default QueueableDriver