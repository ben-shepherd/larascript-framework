/* eslint-disable no-unused-vars */
import BaseService from "@src/core/domains/events/base/BaseService";
import EventDispatchException from "@src/core/domains/events/exceptions/EventDispatchException";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventService } from "@src/core/domains/events/interfaces/IEventService";
import { TEventWorkerOptions } from "@src/core/domains/events/interfaces/IEventWorkerConcern";
import { TMockableEventCallback } from "@src/core/domains/events/interfaces/IMockableConcern";
import { IEventConfig } from "@src/core/domains/events/interfaces/config/IEventConfig";
import { IEventDriversConfigOption } from "@src/core/domains/events/interfaces/config/IEventDriversConfig";
import { IEventListenersConfig, TListenersConfigOption, TListenersMap } from "@src/core/domains/events/interfaces/config/IEventListenersConfig";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IRegsiterList, TRegisterMap } from "@src/core/interfaces/concerns/IHasRegisterableConcern";

import BaseEventListener from "../base/BaseEventListener";


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
     * Retrieves the name of the event driver from its constructor.
     * @param driver The constructor of the event driver.
     * @returns The name of the event driver as a string.
     */
    public static getDriverName(driver: ICtor<IEventDriver>): string {
        return driver.name
    }

    /**
     * @param driverCtor The event driver class.
     * @param options The event driver options.
     * @returns The event driver config.
     */
    public static createConfigDriver<T extends IEventDriversConfigOption['options'] = {}>(driverCtor: ICtor<IEventDriver>, options?: T): IEventDriversConfigOption {
        return {
            driverCtor,
            options
        }
    }

    /**
     * @param events An array of event constructors to be registered.
     * @returns The same array of event constructors.
     */
    public static createConfigEvents(events: ICtor<IBaseEvent>[]): ICtor<IBaseEvent>[] {
        return events
    }

    /**
     * @param config The event listeners config.
     * @returns The event listeners config.
     */
    public static createConfigListeners(config: IEventListenersConfig): IEventListenersConfig {
        return config
    }

    /**
     * @returns The current event configuration as an instance of IEventConfig.
     */
    getConfig(): IEventConfig {
        return this.config
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

    declare assertDispatched: <TPayload = unknown>(eventCtor: ICtor<IBaseEvent>, callback?: TMockableEventCallback<TPayload>) => boolean

    /**
     * Delcare EventWorkerConcern methods.
     */
    declare runWorker: (options: TEventWorkerOptions) => Promise<void>;

    /**
     * Dispatch an event using its registered driver.
     * @param event The event to be dispatched.
     */
    async dispatch(event: IBaseEvent): Promise<void> {     

        if(!this.isRegisteredEvent(event)) {
            throw new EventDispatchException(`Event '${event.getName()}' not registered. The event must be added to the \`events\` array in the config. See @src/config/events.ts`)
        }

        // Mock the dispatch before dispatching the event, as any errors thrown during the dispatch will not be caught
        this.mockEventDispatched(event)

        const eventDriverCtor = event.getDriverCtor()
        const eventDriver = new eventDriverCtor(this)
        await eventDriver.dispatch(event)

        // Notify all subscribers of the event
        if(event instanceof BaseEventListener) {
            await this.notifySubscribers(event); 
        }
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
        const driverIdentifier = EventService.getDriverName(driverConfig.driverCtor)

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
     * Retrieves the configuration options for a given event driver by name.
     * @param driverName The name of the event driver.
     * @returns The configuration options for the specified event driver, or undefined if not found.
     */
    getDriverOptionsByName(driverName: string): IEventDriversConfigOption | undefined {
        const registeredDrivers = this.getRegisteredByList<TRegisterMap<string, IEventDriversConfigOption>>(EventService.REGISTERED_DRIVERS);
        const driverConfig = registeredDrivers.     get(driverName)?.[0];

        return driverConfig ?? undefined
    }

    /**
     * Retrieves the event constructor for a given event name.
     * @param eventName The name of the event.
     * @returns The event constructor for the specified event, or undefined if not found.
     */
    getEventCtorByName(eventName: string): ICtor<IBaseEvent> | undefined {
        const registeredEvents = this.getRegisteredByList<TRegisterMap<string, ICtor<IBaseEvent>>>(EventService.REGISTERED_EVENTS);
        return registeredEvents.get(eventName)?.[0]
    }

    /**
     * Notifies all subscribers of this event that the event has been dispatched.
     *
     * Retrieves all subscribers of this event from the event service, creates
     * a new instance of each subscriber, passing the payload of this event to
     * the subscriber's constructor, and then dispatches the subscriber event
     * using the event service.
     */
    async notifySubscribers(eventListener: BaseEventListener) {
        const subscribers = this.getSubscribers(eventListener.getName());
    
        for (const subscriber of subscribers) {
            const eventSubscriber = new subscriber(null);
            eventSubscriber.setPayload(eventListener.getPayload());
            
            await this.dispatch(eventSubscriber);
        }
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