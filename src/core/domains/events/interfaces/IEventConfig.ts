import { eventDrivers, eventWatchers } from "@src/config/events";
import DriverOptions from "../services/QueueDriverOptions";
import { IEventDriverConstructor } from './IEventDriver';
import { EventListenerConstructor } from "./IEventListener";

export interface IEventDriverOptions {
    driver: IEventDriverConstructor
    options?: DriverOptions
}

export type IEventDrivers = {
    [key: string]: IEventDriverOptions
}

export type IEventWatcher = {
    [key: string]: Array<EventListenerConstructor>
}

export interface IEventConfig<
    Drivers extends IEventDrivers = typeof eventDrivers,
    Watchers extends IEventWatcher = typeof eventWatchers,
    DefaultKey extends keyof Drivers & string = keyof Drivers & string,
> {
    defaultDriver: DefaultKey,
    drivers: Drivers,
    eventWatcher: Watchers
}