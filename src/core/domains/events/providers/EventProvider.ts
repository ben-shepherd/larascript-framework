
import BaseProvider from "../../../base/Provider";
import { App } from "../../../services/App";
import EventDispatcher from "../services/EventDispatcher";
import EventService from "../services/EventService";

export default class EventProvider extends BaseProvider
{
    public async register(): Promise<void> {
        this.log('Registering EventProvider');

        EventDispatcher.getInstance()

        App.setContainer('events', EventService.getInstance());
    }

    public async boot(): Promise<void> {
        this.log('Booting EventProvider');
    }

}