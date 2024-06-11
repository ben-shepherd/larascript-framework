import { IEventConfig } from "../IEventConfig";

export interface IEventDispatcher {
    name: keyof IEventConfig
    dispatch: (event: any, payload: any) => any;
}