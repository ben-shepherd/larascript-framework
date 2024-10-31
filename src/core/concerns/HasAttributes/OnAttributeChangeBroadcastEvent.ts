import BroadcastEvent from "@src/core/domains/broadcast/abstract/BroadcastEvent";
import IModelAttributes from "@src/core/interfaces/IModelData";

export type OnAttributeChangeBroadcastEventPayload = {
    key: string;
    value: unknown;
    attributes: IModelAttributes;
}

class OnAttributeChangeBroadcastEvent extends BroadcastEvent {

    static readonly eventName: string = 'onAttributeChange';

    constructor(data: OnAttributeChangeBroadcastEventPayload) {
        super(data);
    }

    getEventName(): string {
        return OnAttributeChangeBroadcastEvent.eventName;
    }

}

export default OnAttributeChangeBroadcastEvent