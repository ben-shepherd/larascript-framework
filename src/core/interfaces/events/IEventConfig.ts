import { EventListenerConstructor, IEventListener } from "./IEventListener";

export interface IEventConfig {
    [key: string]: Array<EventListenerConstructor<IEventListener>>
}