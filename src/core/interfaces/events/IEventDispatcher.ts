import IDispatchable from "../IDispatchable";
import { IEventConfig } from "../IEventConfig";

export interface IEventDispatcher extends IDispatchable {
    name: keyof IEventConfig
    payload: any;
    dispatch: (event: any, payload: any) => any;
}