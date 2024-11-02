import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import { INameable } from "@src/core/domains/events/interfaces/INameable";

export interface IEventListener extends INameable, IBaseEvent {

}