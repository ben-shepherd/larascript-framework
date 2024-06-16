import { IEventListener } from "../interfaces/IEventListener";
import { IEventPayload } from "../interfaces/IEventPayload";

export default abstract class EventListener<
    Payload extends IEventPayload = IEventPayload
> implements IEventListener {
    handle!: (payload: Payload) => any;
}