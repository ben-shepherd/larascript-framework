/* eslint-disable no-unused-vars */
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";


export type TMockableEventCallback<TPayload = unknown> = (payload: TPayload) => boolean;

export interface IMockableConcern {
    mockEvent(event: TClassConstructor<IBaseEvent>): void;

    mockEventDispatched(event: IBaseEvent): void;

    resetMockEvents(): void;

    assertDispatched<TPayload = unknown>(eventCtor: TClassConstructor<IBaseEvent>, callback?: TMockableEventCallback<TPayload>): boolean;
}