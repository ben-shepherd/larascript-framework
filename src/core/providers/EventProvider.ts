
import BaseProvider from "../base/Provider";
import EventDispatcher from "../events/EventDispatcher";
import Kernel from "../kernel";

export default class EventProvider extends BaseProvider
{
    public async register(): Promise<void> {
        this.log('Registering EventProvider');
        Kernel.getInstance().setContainer('events', EventDispatcher.getInstance());
    }

    public async boot(): Promise<void> {
        this.log('Booting EventProvider');
    }

}