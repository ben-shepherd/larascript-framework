
import { defaultEventDriver, eventDrivers, eventSubscribers } from "@src/config/events";
import BaseProvider from "@src/core/base/Provider";
import { EventServiceConfig } from "@src/core/domains/events/interfaces/IEventService";
import EventService from "@src/core/domains/events/services/EventService";
import { App } from "@src/core/services/App";
import WorkerCommand from "@src/core/domains/console/commands/WorkerCommand";

export default class EventProvider extends BaseProvider {

    protected config: EventServiceConfig = {
        defaultDriver: defaultEventDriver,
        drivers: eventDrivers,
        subscribers: eventSubscribers
    };

    public async register(): Promise<void> {
        this.log('Registering EventProvider');

        /**
         * Register event service
         */
        App.setContainer('events', new EventService(this.config));

        /**
         * Register system provided commands
         */
        App.container('console').register().registerAll([
            WorkerCommand
        ])
    }

    public async boot(): Promise<void> {}

}