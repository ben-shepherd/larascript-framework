import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventDriversConfig } from "@src/core/domains/events/interfaces/config/IEventDriversConfig";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";

import { TListenersConfigOption } from "./IEventListenersConfig";

export interface IEventConfig {
    defaultDriver: TClassConstructor<IEventDriver>;
    drivers: IEventDriversConfig;
    listeners: TListenersConfigOption[];
}