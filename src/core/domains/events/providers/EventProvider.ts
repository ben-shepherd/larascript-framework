import { eventConfig } from "@src/config/events.config";
import BaseProvider from "@src/core/base/Provider";
import WorkerCommand from "@src/core/domains/events/commands/WorkerCommand";
import { IEventConfig } from "@src/core/domains/events/interfaces/config/IEventConfig";
import { IEventService } from "@src/core/domains/events/interfaces/IEventService";
import EventService from "@src/core/domains/events/services/EventService";
import { app } from "@src/core/services/App";

class EventProvider extends BaseProvider {

    protected config: IEventConfig = eventConfig;

    async register(): Promise<void> {
        
        // Create the event Service and register the drivers, events and listeners
        const eventService = new EventService(this.config);
        this.registerDrivers(eventService);
        this.registerEvents(eventService);
        this.registerListeners(eventService);

        // Bind the event service to the container
        this.bind('events', eventService);

        // Register the worker command
        app('console').registerService().registerAll([
            WorkerCommand
        ])
    }

    /**
     * Registers all event drivers defined in the configuration with the provided event service.
     * @param eventService The event service to register drivers with.
     */
    private registerDrivers(eventService: IEventService) {
        for(const driverKey of Object.keys(this.config.drivers)) {
            eventService.registerDriver(this.config.drivers[driverKey]);
        }
    }

    /**
     * Registers all event constructors defined in the configuration with the provided event service.
     * @param eventService The event service to register events with.
     */
    private registerEvents(eventService: IEventService) {
        for(const event of this.config.events) {
            eventService.registerEvent(event);
        }
    }

    /**
     * Registers all event listeners defined in the configuration with the provided event service.
     * @param eventService The event service to register listeners with.
     */
    private registerListeners(eventService: IEventService) {
        for(const listenerConfig of this.config.listeners) {
            eventService.registerListener(listenerConfig)
        }
    }

}

export default EventProvider