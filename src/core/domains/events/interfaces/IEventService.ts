/* eslint-disable no-unused-vars */
import { IEventDriversConfigOption } from "@src/core/domains/events/interfaces/config/IEventDriversConfig";
import { TListenersConfigOption } from "@src/core/domains/events/interfaces/config/IEventListenersConfig";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IHasDispatcherConcern } from "@src/core/domains/events/interfaces/IHasDispatcherConcern";
import { IHasListenerConcern } from "@src/core/domains/events/interfaces/IHasListenerConcern";
import { IMockableConcern } from "@src/core/domains/events/interfaces/IMockableConcern";
import { IHasRegisterableConcern } from "@src/core/interfaces/concerns/IHasRegisterableConcern";
import { ICtor } from "@src/core/interfaces/ICtor";

import { IEventConfig } from "./config/IEventConfig";
import { IEventWorkerConcern } from "./IEventWorkerConcern";

export interface IEventService extends IHasRegisterableConcern, IHasDispatcherConcern, IHasListenerConcern, IEventWorkerConcern, IMockableConcern
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