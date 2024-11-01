/* eslint-disable no-unused-vars */
import IDispatchable from "@src/core/domains/events-legacy/interfaces/IDispatchable";
import { IEvent } from "@src/core/domains/events-legacy/interfaces/IEvent";

export interface IEventDispatcher extends IDispatchable {
    dispatch: (event: IEvent) => Promise<any>;
}