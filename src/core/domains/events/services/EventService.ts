/* eslint-disable no-unused-vars */
import BaseService from "@src/core/domains/events/base/BaseService";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventService } from "@src/core/domains/events/interfaces/IEventService";
import { TMockableEventCallback } from "@src/core/domains/events/interfaces/IMockableConcern";
import { IEventConfig } from "@src/core/domains/events/interfaces/config/IEventConfig";
import { IEventDriversConfigOption } from "@src/core/domains/events/interfaces/config/IEventDriversConfig";
import { IEventListenersConfig, TListenersConfigOption, TListenersMap } from "@src/core/domains/events/interfaces/config/IEventListenersConfig";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IRegsiterList, TRegisterMap } from "@src/core/interfaces/concerns/IHasRegisterableConcern";

class EventService extends BaseService implements IEventService {

    static readonly REGISTERED_DRIVERS = "registeredDrivers";

    static readonly REGISTERED_LISTENERS = "registeredListeners"; 

    static readonly REGISTERED_MOCK_EVENTS = "mockEvents";

    static readonly REGISTERED_MOCK_DISPATCHED = "mockDispatched";

    protected config!: IEventConfig;

    constructor(config: IEventConfig) {
        super()
        this.config = config;
    }

    /**
     * Create an event driver config.
     * @param driverCtor The event driver class.
     * @param options The event driver options.
     * @returns The event driver config.
     */
    public static createConfig<T extends IEventDriversConfigOption['options'] = {}>(driverCtor: ICtor<IEventDriver>, options?: T): IEventDriversConfigOption {
        return {
            driverCtor,
            options
        }
    }

    /**
     * Declare HasRegisterableConcern methods.
     */
    declare register: (key: string, value: unknown) => void;

    declare registerByList: (listName: string, key: string, value: unknown) => void;
    
    declare setRegisteredByList: (listName: string, registered: TRegisterMap) => void;
    
    declare getRegisteredByList: <T extends TRegisterMap = TRegisterMap>(listName: string) => T;
    
    declare getRegisteredList: <T extends TRegisterMap = TRegisterMap>() => T;
    
    declare getRegisteredObject: () => IRegsiterList;

    /**
     * Declare EventMockableConcern methods.
     */
    declare mockEvent: (event: ICtor<IBaseEvent>) => void;

    declare mockEventDispatched: (event: IBaseEvent) => void;

    declare assertDispatched: <T = unknown>(eventCtor: ICtor<IBaseEvent>, callback: TMockableEventCallback<T>) => boolean

    /**
     * Create an event listeners config.
     * @param config The event listeners config.
     * @returns The event listeners config.
     */
    public static createListeners(config: IEventListenersConfig): IEventListenersConfig {
        return config
    }

    /**
     * Dispatch an event using its registered driver.
     * @param event The event to be dispatched.
     */
    async dispatch(event: IBaseEvent): Promise<void> {     

        const eventDriverCtor = event.getDriverCtor()
        const eventDriver = new eventDriverCtor(this)
        await eventDriver.dispatch(event)

        this.mockEventDispatched(event)
    }



    /**
     * Register a driver with the event service
     * @param driverIdentifierConstant a constant string to identify the driver
     * @param driverConfig the driver configuration
     */
    registerDriver(driverIdentifierConstant: string, driverConfig: IEventDriversConfigOption): void {
        this.registerByList(
            EventService.REGISTERED_DRIVERS,
            driverIdentifierConstant,
            driverConfig
        )
    }

    /**
     * Register a listener with the event service
     * @param listenerIdentifierConstant a constant string to identify the listener
     * @param listenerConfig the listener configuration
     */
    registerListener(listenerConfig: TListenersConfigOption): void {
        const listenerIdentifier = listenerConfig.listener.name

        this.registerByList(
            EventService.REGISTERED_LISTENERS,
            listenerIdentifier,
            listenerConfig
        )
    }

    /**
     * Get the default event driver constructor.
     * @returns The default event driver constructor.
     */
    getDefaultDriverCtor(): ICtor<IEventDriver> {
        return this.config.defaultDriver
    }

    /**
     * Returns an array of event subscriber constructors that are listening to this event.
     * @returns An array of event subscriber constructors.
     */
    getSubscribers(eventName: string): ICtor<IBaseEvent>[] {
        const registeredListeners = this.getRegisteredByList<TListenersMap>(EventService.REGISTERED_LISTENERS);
    
        const listenerConfig = registeredListeners.get(eventName)?.[0];
            
        if(!listenerConfig) {
            return [];
        }
    
        return listenerConfig.subscribers;
    }

}

export default EventService