import { IDriverConstructor } from '@src/core/domains/events-legacy/interfaces/IEventDriver';
import { EventListenerConstructor } from "@src/core/domains/events-legacy/interfaces/IEventListener";
import DriverOptions from "@src/core/domains/events-legacy/services/QueueDriverOptions";

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