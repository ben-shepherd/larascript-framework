
import { ListenerConstructor, SubscriberConstructor } from "../IEventConstructors";

export type TListenersConfigOption = {
    listener: ListenerConstructor;
    subscribers: SubscriberConstructor[]
}

export type TListenersMap = Map<string, TListenersConfigOption[]>

export type IEventListenersConfig = TListenersConfigOption[]