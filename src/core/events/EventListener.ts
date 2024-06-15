import { IEventListener } from "../interfaces/events/IEventListener";
import { IEventPayload } from "../interfaces/events/IEventPayload";

export default abstract class EventListener<
    Payload extends IEventPayload = IEventPayload
> implements IEventListener {
    handle!: (payload: Payload) => any;
}