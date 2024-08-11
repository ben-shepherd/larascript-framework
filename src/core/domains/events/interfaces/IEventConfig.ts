import { IDriverConstructor } from '@src/core/domains/Events/interfaces/IEventDriver';
import { EventListenerConstructor } from "@src/core/domains/Events/interfaces/IEventListener";
import DriverOptions from "@src/core/domains/Events/services/QueueDriverOptions";

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