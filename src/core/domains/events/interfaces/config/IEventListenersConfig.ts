import { IEventListener } from "@src/core/domains/events/interfaces/IEventListener";
import { IEventSubscriber } from "@src/core/domains/events/interfaces/IEventSubscriber";
import { ICtor } from "@src/core/interfaces/ICtor";

export type TListenersConfigOption = {
    listener: ICtor<IEventListener>;
    subscribers: ICtor<IEventSubscriber>[]
}

export type IEventListenersConfig = TListenersConfigOption[]