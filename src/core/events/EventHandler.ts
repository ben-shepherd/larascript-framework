import eventsConfig from "@src/config/events";
import { IEventConfig } from "../interfaces/IEventConfig";
import { IEventDispatcher } from "../interfaces/events/IEventDispatcher";
import { IEventPayload } from "../interfaces/events/IEventPayload";

export class EventHandler<
    Payload extends IEventPayload = IEventPayload,
    Name extends keyof IEventConfig = keyof IEventConfig,
> {
    protected name!: Name;
    protected event: IEventDispatcher;
    protected payload: Payload | null = null;

    constructor(event: IEventDispatcher, name: Name, payload: Payload | null = null) {
        this.event = event;
        this.name = name;
        this.payload = payload;
    }

    runEventListeners() {
        const dispatcherName = this.event.name as Name
        console.log(`[EventHandler] dispatching ${dispatcherName}`)

        const listeners = eventsConfig[dispatcherName]

        for(const listener of listeners) {

            console.log('[EventHandler] listener ', listener)

            listener.handle();
        }
    }
}