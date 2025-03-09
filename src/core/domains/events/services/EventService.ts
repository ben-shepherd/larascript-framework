 
import BaseEventListener from "@src/core/domains/events/base/BaseEventListener";
import BaseEventService from "@src/core/domains/events/base/BaseEventService";
import EventDispatchException from "@src/core/domains/events/exceptions/EventDispatchException";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import { SubscriberConstructor } from "@src/core/domains/events/interfaces/IEventConstructors";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventService } from "@src/core/domains/events/interfaces/IEventService";
import { IEventConfig } from "@src/core/domains/events/interfaces/config/IEventConfig";
import { IEventDriversConfigOption } from "@src/core/domains/events/interfaces/config/IEventDriversConfig";
import { TListenersConfigOption } from "@src/core/domains/events/interfaces/config/IEventListenersConfig";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";
import { app } from "@src/core/services/App";

/**
 * Short hand for `app('events')`
 */
export const events = () => app('events');

/**
 * Short hand for `events().dispatch(event)`
 */
export const dispatch = (event: IBaseEvent) => events().dispatch(event);

/**
 * The event service is responsible for managing the event system.
 * It provides features like dispatching events, registering event listeners
 * and drivers.
 * 
 * @class EventService
 * @extends BaseEventService
 * @implements IEventService
 */
class EventService extends BaseEventService implements IEventService {
    
    constructor(config: IEventConfig) {
        super()
        this.config = config;
    }

    /**
     * Retrieves the name of the event driver from its constructor.
     * @param driver The constructor of the event driver.
     * @returns The name of the event driver as a string.
     */
    public static getDriverName(driver: TClassConstructor<IEventDriver>): string {
        return driver.name
    }

    /**
     * @param driverCtor The event driver class.
     * @param options The event driver options.
     * @returns The event driver config.
     */
    public static createConfigDriver<T extends IEventDriversConfigOption['options'] = {}>(driverCtor: TClassConstructor<IEventDriver>, options?: T): IEventDriversConfigOption {
        return {
            driverCtor,
            options
        }
    }

    /**
     * @returns The current event configuration as an instance of IEventConfig.
     */
    getConfig(): IEventConfig {
        return this.config
    }

    /**
     * Dispatch an event using its registered driver.
     * @param event The event to be dispatched.
     */
    async dispatch(event: IBaseEvent): Promise<void> {     

        if(!this.isRegisteredEvent(event)) {
            throw new EventDispatchException(`Event '${event.getName()}' not registered. The event must be exported and registered with EventRegistry.register(event).`)
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
        return this.srHasValue(event.getName(), EventService.REGISTERED_EVENTS)
    }

    /**
     * Register an event with the event service
     * @param event The event class to be registered
     */
    registerEvent(event: TClassConstructor<IBaseEvent>): void {
        if(!this.srListExists(EventService.REGISTERED_EVENTS)) {
            this.srCreateList(EventService.REGISTERED_EVENTS)
        }

        this.srSetValue(new event().getName(), event, EventService.REGISTERED_EVENTS)
    }

    /**
     * Register a driver with the event service
     * @param driverIdentifierConstant a constant string to identify the driver
     * @param driverConfig the driver configuration
     */
    registerDriver(driverConfig: IEventDriversConfigOption): void {
        const driverIdentifier = EventService.getDriverName(driverConfig.driverCtor)

        if(!this.srListExists(EventService.REGISTERED_DRIVERS)) {
            this.srCreateList(EventService.REGISTERED_DRIVERS)
        }

        this.srSetValue(driverIdentifier, driverConfig, EventService.REGISTERED_DRIVERS)
    }


    /**
     * Register listeners with the event service
     * @param options The listeners configuration options.
     */
    registerListeners(options: TListenersConfigOption[]): void {
        for(const option of options) {
            if(!this.srListExists(EventService.REGISTERED_LISTENERS)) {
                this.srCreateList(EventService.REGISTERED_LISTENERS)
            }

            this.srSetValue(new option.listener().getName(), option, EventService.REGISTERED_LISTENERS)
        }
    }


    /**
     * Get the default event driver constructor.
     * @returns The default event driver constructor.
     */
    getDefaultDriverCtor(): TClassConstructor<IEventDriver> {
        return this.config.defaultDriver
    }

    /**
     * Retrieves the configuration options for a given event driver constructor.
     * @param driverCtor The constructor of the event driver.
     * @returns The configuration options for the specified event driver, or undefined if not found.
     */
    getDriverOptions(driver: IEventDriver): IEventDriversConfigOption | undefined {
        return this.getDriverOptionsByName(driver.getName())
    }

    /**
     * Retrieves the configuration options for a given event driver by name.
     * @param driverName The name of the event driver.
     * @returns The configuration options for the specified event driver, or undefined if not found.
     */
    getDriverOptionsByName(driverName: string): IEventDriversConfigOption | undefined {
        return this.srGetValue(driverName, EventService.REGISTERED_DRIVERS) as IEventDriversConfigOption | undefined
    }

    /**
     * Retrieves the event constructor for a given event name.
     * @param eventName The name of the event.
     * @returns The event constructor for the specified event, or undefined if not found.
     */
    getEventCtorByName(eventName: string): TClassConstructor<IBaseEvent> | undefined {
        return this.srGetValue(eventName, EventService.REGISTERED_EVENTS) as TClassConstructor<IBaseEvent> | undefined
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
    getSubscribers(eventName: string): SubscriberConstructor[] {
        const listenerConfig = this.srGetValue(eventName, EventService.REGISTERED_LISTENERS) as TListenersConfigOption | undefined;

        return listenerConfig?.subscribers ?? [];
    }

}

export default EventService