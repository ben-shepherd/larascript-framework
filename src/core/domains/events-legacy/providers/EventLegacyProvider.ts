
import { defaultEventDriver, eventDrivers, eventSubscribers } from "@src/config/eventsLegacy";
import BaseProvider from "@src/core/base/Provider";
import WorkerLegacyCommand from "@src/core/domains/console/commands/WorkerCommand";
import { EventLegacyServiceConfig } from "@src/core/domains/events-legacy/interfaces/IEventService";
import EventService from "@src/core/domains/events-legacy/services/EventService";
import { App } from "@src/core/services/App";

export default class EventLegacyProvider extends BaseProvider {

    protected config: EventLegacyServiceConfig = {
        defaultDriver: defaultEventDriver,
        drivers: eventDrivers,
        subscribers: eventSubscribers
    };

    public async register(): Promise<void> {
        this.log('Registering EventProvider');

        /**
         * Register event service
         */
        App.setContainer('eventsLegacy', new EventService(this.config));

        /**
         * Register system provided commands
         */
        App.container('console').register().registerAll([
            WorkerLegacyCommand
        ])
    }

    public async boot(): Promise<void> {}

}