import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";
import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";

import { TListenersMap } from "../interfaces/config/IEventListenersConfig";
import { IEventService } from "../interfaces/IEventService";
import EventService from "../services/EventService";

abstract class BaseEvent implements IBaseEvent {

    protected payload: IEventPayload | null = null;

    protected driver!: ICtor<IEventDriver>;

    /**
     * Constructor
     * @param payload The payload of the event
     * @param driver The class of the event driver
     */
    constructor(driver: ICtor<IEventDriver> = SyncDriver, payload: IEventPayload | null = null) {
        this.payload = payload;
        this.driver = driver;
    }

    /**
     * Gets the event service that handles event dispatching and listener registration.
     * @returns The event service.
     */
    getEventService(): IEventService {
        return App.container('events');
    }
    
    // eslint-disable-next-line no-unused-vars
    async execute(...args: any[]): Promise<void> {/* Nothing to execute */}

    /**
     * @template T The type of the payload to return.
     * @returns The payload of the event.
     */
    getPayload<T = unknown>(): T {
        return this.payload as T
    }

    /**
     * @returns The name of the event as a string.
     */
    getName(): string {
        return this.constructor.name
    }

    /**
     * @returns The event driver constructor.
     */
    getDriverCtor(): ICtor<IEventDriver> {        
        return this.driver;
    }

    /**
     * Returns an array of event subscriber constructors that are listening to this event.
     * @returns An array of event subscriber constructors.
     */
    getSubscribers(): ICtor<IBaseEvent>[] {
        const eventService = this.getEventService();
        const registeredListeners = eventService.getRegisteredByList<TListenersMap>(EventService.REGISTERED_LISTENERS);

        const listenerConfig = registeredListeners.get(this.getName())?.[0];
        
        if(!listenerConfig) {
            return [];
        }

        return listenerConfig.subscribers;
    }

}

export default BaseEvent