import { eventWatchers } from "@src/config/events";
import { IEventDrivers, IEventWatcher } from "./IEventConfig";
import { IEventPayload } from "./IEventPayload";

export interface IEvent<
    Payload extends IEventPayload = IEventPayload,
    Watchters extends IEventWatcher = typeof eventWatchers,
    Drivers extends IEventDrivers = IEventDrivers
> {
    name: keyof Watchters & string;
    driver: keyof Drivers;
    payload: Payload;
}