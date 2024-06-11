import Singleton from "../base/Singleton";
import { IEventConfig } from "../interfaces/IEventConfig";
import { IEventDispatcher } from "../interfaces/events/IEventDispatcher";
import { IEventPayload } from "../interfaces/events/IEventPayload";
import { EventHandler } from "./EventHandler";


export default class EventDispatcher<
    Payload extends IEventPayload = IEventPayload,
    Name extends keyof IEventConfig = keyof IEventConfig
> extends Singleton implements IEventDispatcher {

    public name!: Name;
    public payload: Payload | null = null;

    constructor(name: Name, payload: Payload | null = null) {
        super()
        this.name = name;
        this.payload = payload
    }

    public static dispatch<
        Event extends IEventDispatcher,
        Payload extends IEventPayload | null = null,
    > (event: Event, payload: Payload | null = null): void {
        EventDispatcher.getInstance().dispatch(event, payload)
    }

    public dispatch<
        Event extends IEventDispatcher,
        Payload extends IEventPayload
    > (event: Event, payload: Payload | null = null) 
    {
        const name = event.name
        const handler = new EventHandler<Payload>(event, name, payload)
        handler.runEventListeners()
    }
}