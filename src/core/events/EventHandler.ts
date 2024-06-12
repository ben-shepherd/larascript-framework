import eventsConfig from "@src/config/events";
import { IEventConfig } from "../interfaces/IEventConfig";
import { IEventDispatcher } from "../interfaces/events/IEventDispatcher";

export class EventHandler<
    Event extends IEventDispatcher = IEventDispatcher,
    Name extends keyof IEventConfig = keyof IEventConfig,
> {
    protected event: IEventDispatcher;

    constructor(event: Event) {
        this.event = event;
    }

    runEventListeners() {
        const dispatcherName = this.event.name as Name
        const { payload } = this.event
        console.log(`[EventHandler] dispatching ${dispatcherName}`, payload)

        const listeners = eventsConfig[dispatcherName]

        for(const listener of listeners) {
            // console.log('[EventHandler] listener ', this.payload)
            listener.handle(payload);
        }
    }
}