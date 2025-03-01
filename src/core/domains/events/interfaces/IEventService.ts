/* eslint-disable no-unused-vars */
import { IEventConfig } from "@src/core/domains/events/interfaces/config/IEventConfig";
import { IEventDriversConfigOption } from "@src/core/domains/events/interfaces/config/IEventDriversConfig";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import { SubscriberConstructor } from "@src/core/domains/events/interfaces/IEventConstructors";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventWorkerConcern } from "@src/core/domains/events/interfaces/IEventWorkerConcern";
import { IMockableConcern } from "@src/core/domains/events/interfaces/IMockableConcern";
import { IDispatchable } from "@src/core/interfaces/concerns/IDispatchable";
import { ISimpleRegister } from "@src/core/interfaces/concerns/ISimpleRegister";
import { ICtor } from "@src/core/interfaces/ICtor";

import { TListenersConfigOption } from "./config/IEventListenersConfig";

export interface IEventService extends ISimpleRegister, IDispatchable, IEventWorkerConcern, IMockableConcern
{
    getConfig(): IEventConfig;

    registerEvent(event: ICtor<IBaseEvent>): void;

    registerDriver(driverConfig: IEventDriversConfigOption): void;

    registerListeners(options: TListenersConfigOption[]): void;
    
    getDefaultDriverCtor(): ICtor<IEventDriver>;

    getDriverOptions(driver: IEventDriver): IEventDriversConfigOption | undefined;

    getDriverOptionsByName(driverName: string): IEventDriversConfigOption | undefined;

    getEventCtorByName(eventName: string): ICtor<IBaseEvent> | undefined;

    getSubscribers(eventName: string): SubscriberConstructor[];

}