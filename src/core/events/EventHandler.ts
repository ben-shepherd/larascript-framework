import { IEvent } from "../interfaces/events/IEvent";
import { IEventConfig } from "../interfaces/events/IEventConfig";

export class EventHandler<
    Event extends IEvent = IEvent,
    Config extends IEventConfig = IEventConfig,
    Name extends keyof Config = keyof Config,
> {
    protected config: IEventConfig;
    protected event: IEvent;

    constructor(config: Config, event: Event) {
        this.config = config;
        this.event = event;
    }   

    runEventListeners() {
        const dispatcherName = this.event.name as Name
        const { payload } = this.event
        console.log(`[EventHandler] dispatching ${dispatcherName as string}`, payload)

        const listeners = this.config[dispatcherName as string] ?? []

        for(const listenerCtor of listeners) {
        console.log('[EventHandler] listener ', this.event)

            const listener = new listenerCtor();
            listener.handle(this.event.payload);
        }
    }
}