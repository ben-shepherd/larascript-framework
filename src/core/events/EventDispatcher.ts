import Singleton from "../base/Singleton";
import { IEvent } from "../interfaces/events/IEvent";
import { IEventConfig } from "../interfaces/events/IEventConfig";
import { IEventDispatcher } from "../interfaces/events/IEventDispatcher";
import { IEventPayload } from "../interfaces/events/IEventPayload";
import { EventHandler } from "./EventHandler";


export default class EventDispatcher<
    Payload extends IEventPayload = IEventPayload,
    Config extends IEventConfig = IEventConfig,
    Name extends keyof Config = keyof Config
> extends Singleton<Config> implements IEventDispatcher {

    protected config: Config
    public name!: Name
    public payload!: Payload

    constructor(config: Config) {
        super(config)
        this.config = config;
    }

    public dispatch<
        Event extends IEvent = IEvent
    > (event: Event) 
    {
        const handler = new EventHandler<Event>(this.config, event)
        handler.runEventListeners()
    }
}