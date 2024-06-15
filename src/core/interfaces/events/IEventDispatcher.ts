import IDispatchable from "../IDispatchable";
import { IEventConfig } from "../IEventConfig";

export interface IEventDispatcher<
    Config extends IEventConfig = IEventConfig
>extends IDispatchable {

    name: keyof Config
    payload: any;
    dispatch: (...args: any[]) => any;
}