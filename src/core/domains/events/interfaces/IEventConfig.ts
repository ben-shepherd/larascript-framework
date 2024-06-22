import DriverOptions from "../services/QueueDriverOptions";
import { IDriverConstructor } from './IEventDriver';
import { EventListenerConstructor } from "./IEventListener";

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