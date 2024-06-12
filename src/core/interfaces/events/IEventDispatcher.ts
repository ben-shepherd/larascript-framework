import { IEventConfig } from "../IEventConfig";

export interface IEventDispatcher {
    name: keyof IEventConfig
    payload: any;
    dispatch: (event: any, payload: any) => any;
}