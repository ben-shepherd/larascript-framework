
import eventsConfig from "@src/config/events";
import BaseProvider from "../../../base/Provider";
import { App } from "../../../services/App";
import EventDispatcher from "../services/EventDispatcher";

export default class EventProvider extends BaseProvider
{
    public async register(): Promise<void> {
        this.log('Registering EventProvider');

        const events = EventDispatcher.getInstance(eventsConfig)

        App.setContainer('events', events);
    }

    public async boot(): Promise<void> {
        this.log('Booting EventProvider');
    }

}