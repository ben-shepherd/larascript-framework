/* eslint-disable no-unused-vars */
 
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventService } from "@src/core/domains/events/interfaces/IEventService";
import { IExecutable } from "@src/core/interfaces/concerns/IExecutable";
import { INameable } from "@src/core/interfaces/concerns/INameable";
import { ICtor } from "@src/core/interfaces/ICtor";


export interface IBaseEvent<TPayload = unknown> extends INameable, IExecutable
{
    getQueueName(): string;
    getEventService(): IEventService;
    getDriverCtor(): ICtor<IEventDriver>;
    getPayload<T extends TPayload>(): T;
    setPayload(payload: TPayload): void;
}