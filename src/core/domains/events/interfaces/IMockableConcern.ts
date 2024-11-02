/* eslint-disable no-unused-vars */
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import { ICtor } from "@src/core/interfaces/ICtor";

export type TMockableEventCallback<T = unknown> = (payload: T) => boolean;

export interface IMockableConcern {
    mockEvent(event: ICtor<IBaseEvent>): void;

    mockEventDispatched(event: IBaseEvent): void;

    assertDispatched<T = unknown>(eventCtor: ICtor<IBaseEvent>, callback: TMockableEventCallback<T>): boolean
}