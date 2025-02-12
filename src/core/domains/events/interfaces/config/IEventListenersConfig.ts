
import { ListenerConstructor, SubscriberConstructor } from "@src/core/domains/events/interfaces/IEventConstructors";

export type TListenersConfigOption = {
    listener: ListenerConstructor;
    subscribers: SubscriberConstructor[]
}

export type TListenersMap = Map<string, TListenersConfigOption[]>

export type IEventListenersConfig = TListenersConfigOption[]