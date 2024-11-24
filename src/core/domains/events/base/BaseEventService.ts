/* eslint-disable no-unused-vars */
import HasRegisterableConcern from "@src/core/concerns/HasRegisterableConcern";
import { IEventConfig } from "@src/core/domains/events/interfaces/config/IEventConfig";
import { IRegsiterList, TRegisterMap } from "@src/core/interfaces/concerns/IHasRegisterableConcern";
import { ICtor } from "@src/core/interfaces/ICtor";
import compose from "@src/core/util/compose";

import EventMockableConcern from "../concerns/EventMockableConcern";
import EventWorkerConcern from "../concerns/EventWorkerConcern";
import { IBaseEvent } from "../interfaces/IBaseEvent";
import { TEventWorkerOptions } from "../interfaces/IEventWorkerConcern";
import { TMockableEventCallback } from "../interfaces/IMockableConcern";


class BaseEventService extends compose(class {}, HasRegisterableConcern, EventWorkerConcern, EventMockableConcern) {

    static readonly REGISTERED_EVENTS = "registeredEvents";

    static readonly REGISTERED_DRIVERS = "registeredDrivers";

    static readonly REGISTERED_LISTENERS = "registeredListeners"; 

    static readonly REGISTERED_MOCK_EVENTS = "mockEvents";

    static readonly REGISTERED_MOCK_DISPATCHED = "mockDispatched";

    protected config!: IEventConfig;

    /**
     * Declare HasRegisterableConcern methods.
     */
    declare register: (key: string, value: unknown) => void;

    declare registerByList: (listName: string, key: string, value: unknown) => void;
    
    declare setRegisteredByList: (listName: string, registered: TRegisterMap) => void;
    
    declare getRegisteredByList: <T extends TRegisterMap = TRegisterMap>(listName: string) => T;
    
    declare getRegisteredList: <T extends TRegisterMap = TRegisterMap>() => T;
    
    declare getRegisteredObject: () => IRegsiterList;

    declare isRegisteredInList: (listName: string, key: string) => boolean;

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