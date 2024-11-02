/* eslint-disable no-unused-vars */
import { IEvent } from "@src/core/domains/events-legacy/interfaces/IEvent";
import { IDriverConfig, IEventDrivers, ISubscribers } from "@src/core/domains/events-legacy/interfaces/IEventConfig";
import { EventListenerConstructor } from "@src/core/domains/events-legacy/interfaces/IEventListener";
import { IEventPayload } from "@src/core/domains/events-legacy/interfaces/IEventPayload";

export interface EventLegacyServiceConfig {
    defaultDriver: string;
    drivers: IEventDrivers;
    subscribers: ISubscribers;
}

export interface IEventLegacyService {
    config: EventLegacyServiceConfig;
    dispatch<Payload extends IEventPayload>(event: IEvent<Payload>): Promise<void>;
    getListenersByEventName(eventName: string): EventListenerConstructor[];
    getDriver(driverName: string): IDriverConfig;
}