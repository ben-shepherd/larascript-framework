import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IExecutable } from "@src/core/domains/events/interfaces/IExecutable";
import { INameable } from "@src/core/domains/events/interfaces/INameable";
import { ICtor } from "@src/core/interfaces/ICtor";

export interface IBaseEvent extends INameable, IExecutable
{
    getDriverCtor(): ICtor<IEventDriver>;
}