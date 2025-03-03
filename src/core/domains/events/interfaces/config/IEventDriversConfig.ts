import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";

export interface IEventDriversConfigOption {
    driverCtor: TClassConstructor<IEventDriver>,
    options?: Record<string, unknown>;
}

export type TEventDriversRegister = Record<string, IEventDriversConfigOption>;

export interface IEventDriversConfig
{
    [key: string]: IEventDriversConfigOption
}