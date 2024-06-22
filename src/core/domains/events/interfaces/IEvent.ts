import { eventSubscribers } from "@src/config/events";
import { IEventDrivers, ISubscribers } from "./IEventConfig";
import { IEventPayload } from "./IEventPayload";

export interface IEvent<
    Payload extends IEventPayload = IEventPayload,
    Watchters extends ISubscribers = typeof eventSubscribers,
    Drivers extends IEventDrivers = IEventDrivers
> {
    name: keyof Watchters & string;
    driver: keyof Drivers;
    payload: Payload;
}