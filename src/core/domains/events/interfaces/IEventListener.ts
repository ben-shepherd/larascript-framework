import { INameable } from "@src/core/domains/events/interfaces/INameable";

import { IBaseEvent } from "./IBaseEvent";

export interface IEventListener extends INameable, IBaseEvent {

}