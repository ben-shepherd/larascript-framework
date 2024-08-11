import { IEventListener } from "@src/core/domains/events/interfaces/IEventListener";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";

export default abstract class EventListener<
    Payload extends IEventPayload = IEventPayload
> implements IEventListener {
    handle!: (payload: Payload) => any;
}