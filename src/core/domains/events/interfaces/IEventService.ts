import { IEvent } from "@src/core/domains/Events/interfaces/IEvent";
import { IDriverConfig, IEventDrivers, ISubscribers } from "@src/core/domains/Events/interfaces/IEventConfig";
import { EventListenerConstructor } from "@src/core/domains/Events/interfaces/IEventListener";
import { IEventPayload } from "@src/core/domains/Events/interfaces/IEventPayload";

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