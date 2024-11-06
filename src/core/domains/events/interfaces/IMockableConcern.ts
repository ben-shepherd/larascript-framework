/* eslint-disable no-unused-vars */
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import { ICtor } from "@src/core/interfaces/ICtor";


export type TMockableEventCallback<TPayload = unknown> = (payload: TPayload) => boolean;

export interface IMockableConcern {
    mockEvent(event: ICtor<IBaseEvent>): void;

    mockEventDispatched(event: IBaseEvent): void;

    assertDispatched<TPayload = unknown>(eventCtor: ICtor<IBaseEvent>, callback?: TMockableEventCallback<TPayload>): boolean;
}