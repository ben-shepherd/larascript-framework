import IDispatchable from "./IDispatchable";

export interface IEventDispatcher extends IDispatchable {
    dispatch: (...args: any[]) => any;
}