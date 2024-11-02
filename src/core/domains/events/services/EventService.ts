/* eslint-disable no-unused-vars */
import BaseService from "@src/core/domains/events/base/BaseService";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventService } from "@src/core/domains/events/interfaces/IEventService";
import { IEventConfig } from "@src/core/domains/events/interfaces/config/IEventConfig";
import { IEventDriversConfigOption } from "@src/core/domains/events/interfaces/config/IEventDriversConfig";
import { IEventListenersConfig, TListenersConfigOption } from "@src/core/domains/events/interfaces/config/IEventListenersConfig";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IRegsiterList, TRegisterMap } from "@src/core/interfaces/concerns/IHasRegisterableConcern";

class EventService extends BaseService implements IEventService {

    static readonly REGISTERED_DRIVERS = "registeredDrivers";

    static readonly REGISTERED_LISTENERS = "registeredListeners";

    protected config!: IEventConfig;

    constructor(config: IEventConfig) {
        super(config)
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
    
    declare setRegisteredByList: (listName: string, registered: Map<string, unknown>) => void;
    
    declare getRegisteredByList: (listName: string) => Map<unknown, unknown>;
    
    declare getRegisteredList: () => TRegisterMap;
    
    declare getRegisteredObject: () => IRegsiterList;

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
        const listenerIdentifier = new listenerConfig.listener().getName()

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

}

export default EventService