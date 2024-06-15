import { IEvent } from "../interfaces/events/IEvent";
import { IEventPayload } from "../interfaces/events/IEventPayload";

export type EventConstructor<Event extends IEvent = IEvent, Payload extends IEventPayload = IEventPayload> = new (payload: Payload) => Event

export default class Event<
    Payload extends IEventPayload = IEventPayload
> implements IEvent {

    public name!: string;
    public payload: Payload;

    constructor(payload: Payload) {
        this.payload = payload;
    }
}