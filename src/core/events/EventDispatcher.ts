import Singleton from "../base/Singleton";
import { IEventConfig } from "../interfaces/IEventConfig";
import { IEventDispatcher } from "../interfaces/events/IEventDispatcher";
import { IEventPayload } from "../interfaces/events/IEventPayload";
import { EventHandler } from "./EventHandler";


export default class EventDispatcher<Payload extends IEventPayload = IEventPayload, Name extends keyof IEventConfig = keyof IEventConfig> extends Singleton implements IEventDispatcher {

    public name!: Name;
    public payload!: Payload

    public dispatch<
        Event extends IEventDispatcher
    > (event: Event) 
    {
        const handler = new EventHandler<Event>(event)
        handler.runEventListeners()
    }
}