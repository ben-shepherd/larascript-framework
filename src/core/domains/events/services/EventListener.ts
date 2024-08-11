import { IEventListener } from "@src/core/domains/Events/interfaces/IEventListener";
import { IEventPayload } from "@src/core/domains/Events/interfaces/IEventPayload";

export default abstract class EventListener<
    Payload extends IEventPayload = IEventPayload
> implements IEventListener {
    handle!: (payload: Payload) => any;
}