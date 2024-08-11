import { IDriverConstructor } from '@src/core/domains/events/interfaces/IEventDriver';
import { EventListenerConstructor } from "@src/core/domains/events/interfaces/IEventListener";
import DriverOptions from "@src/core/domains/events/services/QueueDriverOptions";

export interface IDriverConfig {
    driver: IDriverConstructor
    options?: DriverOptions
}

export type IEventDrivers = {
    [key: string]: IDriverConfig
}

export type ISubscribers = {
    [key: string]: Array<EventListenerConstructor>
}