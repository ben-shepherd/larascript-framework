import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import { INameable } from "@src/core/interfaces/concerns/INameable";

export interface IEventListener<TPayload = unknown> extends INameable, IBaseEvent<TPayload> {

}