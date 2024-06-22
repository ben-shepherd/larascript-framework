import { IEvent } from "./IEvent";
import { IDriverConfig, IEventDrivers, ISubscribers } from "./IEventConfig";
import { EventListenerConstructor } from "./IEventListener";
import { IEventPayload } from "./IEventPayload";

export interface EventServiceConfig {
    defaultDriver: string;
    drivers: IEventDrivers;
    subscribers: ISubscribers
}

export interface IEventService {
    config: EventServiceConfig;
    dispatch<Payload extends IEventPayload>(event: IEvent<Payload>): void;
    getListenersByEventName(eventName: string): EventListenerConstructor[];
    getDriver(driverName: string): IDriverConfig;
}