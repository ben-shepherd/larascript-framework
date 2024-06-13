import { IEventListener } from "./events/IEventListener";

export interface IEventConfig {
    [key: string]: Array<IEventListener>
}