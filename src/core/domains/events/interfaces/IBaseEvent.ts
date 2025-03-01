/* eslint-disable no-unused-vars */
 
import { IHasCastableConcern } from "@src/core/domains/cast/interfaces/IHasCastableConcern";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventService } from "@src/core/domains/events/interfaces/IEventService";
import { IExecutable } from "@src/core/interfaces/concerns/IExecutable";
import { INameable } from "@src/core/interfaces/concerns/INameable";
import { ICtor } from "@src/core/interfaces/ICtor";

export interface IBaseSubscriber<TPayload = unknown> extends IBaseEvent<TPayload> {
    type: 'subscriber';
}

export interface IBaseListener<TPayload = unknown> extends IBaseEvent<TPayload> {
    type: 'listener';
}

export interface IBaseEvent<TPayload = unknown> extends INameable, IExecutable, IHasCastableConcern
{
    getQueueName(): string;
    getEventService(): IEventService;
    getDriverCtor(): ICtor<IEventDriver>;
    getPayload(): TPayload;
    setPayload(payload: TPayload): void;
    getName(): string;
}