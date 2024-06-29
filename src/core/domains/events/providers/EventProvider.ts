
import { defaultEventDriver, eventDrivers, eventSubscribers } from "@src/config/events";
import BaseProvider from "../../../base/Provider";
import { App } from "../../../services/App";
import { EventServiceConfig } from "../interfaces/IEventService";
import EventService from "../services/EventService";

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

    public async boot(): Promise<void> 
    {
        this.log('Booting EventProvider');
    }

}