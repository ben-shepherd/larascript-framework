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

import EventDispatchException from "../exceptions/EventDispatchException";

class EventService extends BaseService implements IEventService {

    static readonly REGISTERED_EVENTS = "registeredEvents";

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
     * @param events An array of event constructors to be registered.
     * @returns The same array of event constructors.
     */
    public static createEvents(events: ICtor<IBaseEvent>[]): ICtor<IBaseEvent>[] {
        return events
    }

    /**
     * @param config The event listeners config.
     * @returns The event listeners config.
     */
    public static createListeners(config: IEventListenersConfig): IEventListenersConfig {
        return config
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

    declare assertDispatched: <T = unknown>(eventCtor: ICtor<IBaseEvent>, callback?: TMockableEventCallback<T>) => boolean

    /**
     * Dispatch an event using its registered driver.
     * @param event The event to be dispatched.
     */
    async dispatch(event: IBaseEvent): Promise<void> {     

        if(!this.isRegisteredEvent(event)) {
            throw new EventDispatchException(`Event '${event.getName()}' not registered. The event must be added to the \`events\` array in the config. See @src/config/events.ts`)
        }

        const eventDriverCtor = event.getDriverCtor()
        const eventDriver = new eventDriverCtor(this)
        await eventDriver.dispatch(event)

        this.mockEventDispatched(event)
    }

    /**
     * @param event The event class to be checked
     * @returns True if the event is registered, false otherwise
     * @private
     */
    private isRegisteredEvent(event: IBaseEvent): boolean {
        return this.getRegisteredByList<TRegisterMap<string, ICtor<IBaseEvent>>>(EventService.REGISTERED_EVENTS).has(event.getName());
    }

    /**
     * Register an event with the event service
     * @param event The event class to be registered
     */
    registerEvent(event: ICtor<IBaseEvent>): void {
        this.registerByList(
            EventService.REGISTERED_EVENTS,
            new event().getName(),
            event
        )
    }

    /**
     * Register a driver with the event service
     * @param driverIdentifierConstant a constant string to identify the driver
     * @param driverConfig the driver configuration
     */
    registerDriver(driverConfig: IEventDriversConfigOption): void {
        const driverIdentifier = driverConfig.driverCtor.name

        this.registerByList(
            EventService.REGISTERED_DRIVERS,
            driverIdentifier,
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


        // Update registered listeners
        this.registerByList(
            EventService.REGISTERED_LISTENERS,
            listenerIdentifier,
            listenerConfig
        )

        // Update the registered events from the listener and subscribers
        this.registerEventsFromListenerConfig(listenerConfig)
    }

    /**
     * Registers the events associated with the listener configuration with the event service.
     * Iterates over the subscribers and registers each subscriber event with the event service.
     * @param listenerConfig The listener configuration.
     */
    private registerEventsFromListenerConfig(listenerConfig: TListenersConfigOption): void {
        
        // Update registered events with the listener
        this.registerEvent(listenerConfig.listener)

        // Update the registered events from the subscribers
        for(const subscriber of listenerConfig.subscribers) {
            this.registerEvent(subscriber)
        }
    }

    /**
     * Get the default event driver constructor.
     * @returns The default event driver constructor.
     */
    getDefaultDriverCtor(): ICtor<IEventDriver> {
        return this.config.defaultDriver
    }

    /**
     * Retrieves the configuration options for a given event driver constructor.
     * @param driverCtor The constructor of the event driver.
     * @returns The configuration options for the specified event driver, or undefined if not found.
     */
    getDriverOptions(driver: IEventDriver): IEventDriversConfigOption | undefined {
        const registeredDrivers = this.getRegisteredByList<TRegisterMap<string, IEventDriversConfigOption>>(EventService.REGISTERED_DRIVERS);
        const driverConfig = registeredDrivers.get(driver.getName())?.[0];

        return driverConfig ?? undefined
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