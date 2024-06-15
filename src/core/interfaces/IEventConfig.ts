import { EventListenerConstructor, IEventListener } from "./events/IEventListener";

export interface IEventConfig {
    [key: string]: Array<EventListenerConstructor<IEventListener>>
}