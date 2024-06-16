import IDispatchable from "./IDispatchable";
import { IEvent } from "./IEvent";

export interface IEventDispatcher extends IDispatchable {
    dispatch: (event: IEvent) => Promise<any>;
}