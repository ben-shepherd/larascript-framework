/* eslint-disable no-unused-vars */
import HasSimpleRegisterConcern from "@src/core/concerns/HasSimpleRegisterConcern";
import { IEventConfig } from "@src/core/domains/events/interfaces/config/IEventConfig";
import { ICommandOptionArguement, IOptionTypes } from "@src/core/interfaces/concerns/ISimpleRegister";
import { ICtor } from "@src/core/interfaces/ICtor";
import compose from "@src/core/util/compose";

import EventMockableConcern from "../concerns/EventMockableConcern";
import EventWorkerConcern from "../concerns/EventWorkerConcern";
import { IBaseEvent } from "../interfaces/IBaseEvent";
import { TEventWorkerOptions } from "../interfaces/IEventWorkerConcern";
import { TMockableEventCallback } from "../interfaces/IMockableConcern";


class BaseEventService extends compose(class {}, HasSimpleRegisterConcern, EventWorkerConcern, EventMockableConcern) {

    static readonly REGISTERED_EVENTS = "registeredEvents";

    static readonly REGISTERED_DRIVERS = "registeredDrivers";

    static readonly REGISTERED_LISTENERS = "registeredListeners"; 

    static readonly REGISTERED_MOCK_EVENTS = "mockEvents";

    static readonly REGISTERED_MOCK_DISPATCHED = "mockDispatched";

    protected config!: IEventConfig;
    
    /**
     * Declare simple register concern 
     */
    declare srCreateList: (listName: string, listValue?: IOptionTypes['listValue']) => void;

    declare srListExists: (listName: string) => boolean;

    declare srUpdateList: (listName: string, listValue: IOptionTypes['listValue']) => void;

    declare srGetList: (listName: string) => IOptionTypes['listValue'];

    declare srClearList: (listName: string) => void;

    declare srDeleteList: (listName: string) => void;

    declare srSetValue: (key: string, value: unknown, listName: string) => void;

    declare srHasValue: (key: string, listName: string) => boolean;

    declare srGetValue: (key: string, listName: string) => unknown;

    declare srCommand: <K extends keyof ICommandOptionArguement = keyof ICommandOptionArguement>(command: K, options?: ICommandOptionArguement[K]['options']) => ICommandOptionArguement[K]['returns'];

    /**
     * Declare EventMockableConcern methods.
     */
    declare mockEvent: (event: ICtor<IBaseEvent>) => void;

    declare mockEventDispatched: (event: IBaseEvent) => void;

    declare assertDispatched: <TPayload = unknown>(eventCtor: ICtor<IBaseEvent>, callback?: TMockableEventCallback<TPayload>) => boolean

    /**
     * Delcare EventWorkerConcern methods.
     */
    declare runWorker: (options: TEventWorkerOptions) => Promise<void>;

}

export default BaseEventService