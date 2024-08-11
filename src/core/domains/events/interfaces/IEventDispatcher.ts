import IDispatchable from "@src/core/domains/Events/interfaces/IDispatchable";
import { IEvent } from "@src/core/domains/Events/interfaces/IEvent";

export interface IEventDispatcher extends IDispatchable {
    dispatch: (event: IEvent) => Promise<any>;
}