import BroadcastEvent from "@src/core/domains/broadcast/abstract/BroadcastEvent";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";

class DispatchBroadcastEvent extends BroadcastEvent {

    static readonly eventName: string = "dispatch";

    constructor(payload: IBaseEvent) {
        super(payload);
    }

    getName(): string {
        return DispatchBroadcastEvent.eventName;
    }

}

export default DispatchBroadcastEvent