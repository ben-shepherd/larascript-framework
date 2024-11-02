import { EVENT_DRIVERS } from "@src/config/events";
import BaseDriver from "@src/core/domains/events/base/BaseDriver";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";

class SyncDriver extends BaseDriver  {

    async dispatch(event: IBaseEvent): Promise<void> {
        await event.execute();
    }

    getName(): string {
        return EVENT_DRIVERS.SYNC;
    }

}

export default SyncDriver