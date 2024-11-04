/* eslint-disable no-unused-vars */
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import { ICtor } from "@src/core/interfaces/ICtor";

import { TISerializablePayload } from "./IEventPayload";

export type TMockableEventCallback<TPayload extends TISerializablePayload = TISerializablePayload> = (payload: TPayload) => boolean;

export interface IMockableConcern {
    mockEvent(event: ICtor<IBaseEvent>): void;

    mockEventDispatched(event: IBaseEvent): void;

    assertDispatched<TPayload extends TISerializablePayload = TISerializablePayload>(eventCtor: ICtor<IBaseEvent>, callback?: TMockableEventCallback<TPayload>): boolean;
}