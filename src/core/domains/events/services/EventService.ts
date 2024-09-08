import Singleton from "@src/core/base/Singleton";
import EventDriverException from "@src/core/domains/events/exceptions/EventDriverException";
import { IEvent } from "@src/core/domains/events/interfaces/IEvent";
import { IDriverConfig } from "@src/core/domains/events/interfaces/IEventConfig";
import { EventListenerConstructor } from "@src/core/domains/events/interfaces/IEventListener";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";
import { EventServiceConfig, IEventService } from "@src/core/domains/events/interfaces/IEventService";
import EventDispatcher from "@src/core/domains/events/services/EventDispatcher";

export default class EventService extends Singleton<EventServiceConfig>  implements IEventService {

    public config!: EventServiceConfig;

    constructor(config: EventServiceConfig) {
        super(config);
    }

    /**
     * Dispatch an event
     * @param event 
     * @returns 
     */
    async dispatch<Payload extends IEventPayload>(event: IEvent<Payload>) {
        return await (new EventDispatcher).dispatch(event);
    }

    /**
     * Get an array of listeners by the event name
     * @param eventName 
     * @returns 
     */
    getListenersByEventName(eventName: string): EventListenerConstructor[] {
        return this.config.subscribers[eventName] ?? [];
    }

    /**
     * Get event driver
     * @param driverName 
     * @returns 
     */
    getDriver(driverName: string): IDriverConfig {
        if(!this.config.drivers[driverName]) {
            throw new EventDriverException(`Driver '${driverName}' not found`);
        }
        return this.config.drivers[driverName];
    }

}