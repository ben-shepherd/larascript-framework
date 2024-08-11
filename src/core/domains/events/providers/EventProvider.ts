
import { defaultEventDriver, eventDrivers, eventSubscribers } from "@src/config/events";
import BaseProvider from "@src/core/base/Provider";
import { EventServiceConfig } from "@src/core/domains/Events/interfaces/IEventService";
import EventService from "@src/core/domains/Events/services/EventService";
import { App } from "@src/core/services/App";

export default class EventProvider extends BaseProvider
{
    public async register(): Promise<void> 
    {
        this.log('Registering EventProvider');

        const config: EventServiceConfig = {
            defaultDriver: defaultEventDriver,
            drivers: eventDrivers,
            subscribers: eventSubscribers
        };
        App.setContainer('events', new EventService(config));
    }

    public async boot(): Promise<void> {}

}