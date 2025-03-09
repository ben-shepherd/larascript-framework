import BaseDriver from "@src/core/domains/events/base/BaseDriver";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";

class SyncDriver extends BaseDriver  {

    async dispatch(event: IBaseEvent): Promise<void> {
        await event.execute();
    }
    
}

export default SyncDriver