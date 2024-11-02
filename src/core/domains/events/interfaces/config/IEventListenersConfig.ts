import { IEventListener } from "@src/core/domains/events/interfaces/IEventListener";
import { ICtor } from "@src/core/interfaces/ICtor";

import { IBaseEvent } from "../IBaseEvent";

export type TListenersConfigOption = {
    listener: ICtor<IEventListener>;
    subscribers: ICtor<IBaseEvent>[]
}

export type TListenersMap = Map<string, TListenersConfigOption[]>

export type IEventListenersConfig = TListenersConfigOption[]