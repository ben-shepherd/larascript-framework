 
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventService } from "@src/core/domains/events/interfaces/IEventService";
import { IExecutable } from "@src/core/interfaces/concerns/IExecutable";
import { INameable } from "@src/core/interfaces/concerns/INameable";
import { ICtor } from "@src/core/interfaces/ICtor";

export interface IBaseEvent extends INameable, IExecutable
{
    getQueueName(): string;
    getEventService(): IEventService;
    getDriverCtor(): ICtor<IEventDriver>;
    getPayload<T = unknown>(): T;
}