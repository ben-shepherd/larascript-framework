import IDispatchable from "@src/core/domains/events/interfaces/IDispatchable";
import { IEvent } from "@src/core/domains/events/interfaces/IEvent";

export interface IEventDispatcher extends IDispatchable {
    dispatch: (event: IEvent) => Promise<any>;
}