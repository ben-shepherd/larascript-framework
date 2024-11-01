import Singleton from "@src/core/base/Singleton";
import EventDriverException from "@src/core/domains/events-legacy/exceptions/EventDriverException";
import { IEvent } from "@src/core/domains/events-legacy/interfaces/IEvent";
import { IDriverConfig } from "@src/core/domains/events-legacy/interfaces/IEventConfig";
import { EventListenerConstructor } from "@src/core/domains/events-legacy/interfaces/IEventListener";
import { IEventPayload } from "@src/core/domains/events-legacy/interfaces/IEventPayload";
import { EventServiceConfig, IEventService } from "@src/core/domains/events-legacy/interfaces/IEventService";
import EventDispatcher from "@src/core/domains/events-legacy/services/EventDispatcher";

/**
 * Event Service
 *
 * Provides methods for dispatching events and retrieving event listeners.
 */
export default class EventService extends Singleton<EventServiceConfig>  implements IEventService {

    /**
     * Config.
     */
    public config!: EventServiceConfig;

    /**
     * Constructor.
     * @param config Event service config.
     */
    constructor(config: EventServiceConfig) {
        super(config);
    }

    /**
     * Dispatch an event.
     * @param event Event to dispatch.
     * @returns 
     */
    async dispatch<Payload extends IEventPayload>(event: IEvent<Payload>) {
        return await (new EventDispatcher).dispatch(event);
    }

    /**
     * Get an array of listeners by the event name.
     * @param eventName Event name.
     * @returns Array of listeners.
     */
    getListenersByEventName(eventName: string): EventListenerConstructor[] {
        return this.config.subscribers[eventName] ?? [];
    }

    /**
     * Get event driver.
     * @param driverName Driver name.
     * @returns Driver config.
     */
    getDriver(driverName: string): IDriverConfig {
        if(!this.config.drivers[driverName]) {
            throw new EventDriverException(`Driver '${driverName}' not found`);
        }
        return this.config.drivers[driverName];
    }

}

