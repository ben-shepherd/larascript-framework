 
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventService } from "@src/core/domains/events/interfaces/IEventService";
import { IExecutable } from "@src/core/domains/events/interfaces/IExecutable";
import { INameable } from "@src/core/domains/events/interfaces/INameable";
import { ICtor } from "@src/core/interfaces/ICtor";

export interface IBaseEvent extends INameable, IExecutable
{
    getEventService(): IEventService;
    getDriverCtor(): ICtor<IEventDriver>;
    getPayload<T = unknown>(): T;
}