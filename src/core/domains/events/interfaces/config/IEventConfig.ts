import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventDriversConfig } from "@src/core/domains/events/interfaces/config/IEventDriversConfig";
import { ICtor } from "@src/core/interfaces/ICtor";

export interface IEventConfig {
    defaultDriver: ICtor<IEventDriver>;
    drivers: IEventDriversConfig;
}