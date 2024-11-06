/* eslint-disable no-unused-vars */
import { IEventConfig } from "@src/core/domains/events/interfaces/config/IEventConfig";
import { IEventDriversConfigOption } from "@src/core/domains/events/interfaces/config/IEventDriversConfig";
import { TListenersConfigOption } from "@src/core/domains/events/interfaces/config/IEventListenersConfig";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventWorkerConcern } from "@src/core/domains/events/interfaces/IEventWorkerConcern";
import { IMockableConcern } from "@src/core/domains/events/interfaces/IMockableConcern";
import { IDispatchable } from "@src/core/interfaces/concerns/IDispatchable";
import { IHasRegisterableConcern } from "@src/core/interfaces/concerns/IHasRegisterableConcern";
import { ICtor } from "@src/core/interfaces/ICtor";

export interface IEventService extends IHasRegisterableConcern, IDispatchable, IEventWorkerConcern, IMockableConcern
{
    getConfig(): IEventConfig;

    registerEvent(event: ICtor<IBaseEvent>): void;

    registerDriver(driverConfig: IEventDriversConfigOption): void;

    registerListener(listenerConfig: TListenersConfigOption): void;

    getDefaultDriverCtor(): ICtor<IEventDriver>;

    getDriverOptions(driver: IEventDriver): IEventDriversConfigOption | undefined;

    getDriverOptionsByName(driverName: string): IEventDriversConfigOption | undefined;

    getEventCtorByName(eventName: string): ICtor<IBaseEvent> | undefined;

    getSubscribers(eventName: string): ICtor<IBaseEvent>[];
}