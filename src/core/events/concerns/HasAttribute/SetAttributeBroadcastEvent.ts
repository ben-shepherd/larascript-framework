import BroadcastEvent from "@src/core/domains/broadcast/abstract/BroadcastEvent";

export type SetAttributeBroadcastEventPayload = {
    key: string;
    value: unknown;
}

class SetAttributeBroadcastEvent extends BroadcastEvent {

    static readonly eventName: string = 'setAttribute';

    constructor(data: SetAttributeBroadcastEventPayload) {
        super(data);
    }

    getEventName(): string {
        return SetAttributeBroadcastEvent.eventName;
    }

}

export default SetAttributeBroadcastEvent