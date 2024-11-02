import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { ICtor } from "@src/core/interfaces/ICtor";

export interface IEventDriversConfigOption {
    driverCtor: ICtor<IEventDriver>,
    options?: Record<string, unknown>;
}

export interface IEventDriversConfig
{
    [key: string]: IEventDriversConfigOption
}