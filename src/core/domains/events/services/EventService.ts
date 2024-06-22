import Singleton from "@src/core/base/Singleton";
import EventDriverException from "../exceptions/EventDriverException";
import { IEvent } from "../interfaces/IEvent";
import { IDriverConfig } from "../interfaces/IEventConfig";
import { EventListenerConstructor } from "../interfaces/IEventListener";
import { IEventPayload } from "../interfaces/IEventPayload";
import { EventServiceConfig, IEventService } from "../interfaces/IEventService";
import EventDispatcher from "./EventDispatcher";

export default class EventService extends Singleton<EventServiceConfig>  implements IEventService
{
    public config!: EventServiceConfig;

    constructor(config: EventServiceConfig) {
        super(config);
    }

    /**
     * Dispatch an event
     * @param event 
     * @returns 
     */
    dispatch<Payload extends IEventPayload>(event: IEvent<Payload>) {
        return EventDispatcher.getInstance().dispatch(event);
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