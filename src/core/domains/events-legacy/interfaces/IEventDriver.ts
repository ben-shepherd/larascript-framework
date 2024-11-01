/* eslint-disable no-unused-vars */
import { IEvent } from "@src/core/domains/events-legacy/interfaces/IEvent";
import { IEventPayload } from "@src/core/domains/events-legacy/interfaces/IEventPayload";

export type IDriverConstructor<
Payload extends IEventPayload = IEventPayload,
Options extends object = object,
Driver extends IEventDriver = IEventDriver<Payload, Options>
> = new (...args: any[]) => Driver;

export default interface IEventDriver<Payload extends IEventPayload = IEventPayload, Options extends object = object> {
    handle(event: IEvent<Payload>, options?: Options): any;
}