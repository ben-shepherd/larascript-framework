import Singleton from "@src/core/base/Singleton";
import { IEvent } from "@src/core/domains/events/interfaces/IEvent";
import { IDriverConfig } from "@src/core/domains/events/interfaces/IEventConfig";
import { IEventDispatcher } from "@src/core/domains/events/interfaces/IEventDispatcher";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";
import { App } from "@src/core/services/App";


export default class EventDispatcher extends Singleton implements IEventDispatcher {

    /**
     * Handle the dispatched event
     * @param event 
     */
    public async dispatch<Payload extends IEventPayload>(event: IEvent<Payload>) {
        App.container('logger').info(`[EventDispatcher:dispatch] Event '${event.name}' with driver '${event.driver}'`)

        const driverOptions = this.getDriverOptionsFromEvent(event)
        const driverCtor = driverOptions.driver
        
        const instance = new driverCtor();
        await instance.handle(event, driverOptions.options?.getOptions());
    }

    /**
     * Get the driver constructor based on the name of the worker defiend in the Event
     * @param IEvent event
     * @returns 
     */
    protected getDriverOptionsFromEvent(event: IEvent): IDriverConfig {
        const driver = App.container('events').config.drivers[event.driver]

        if(!driver) {
            throw new Error('Driver not found \'' + event.driver + '\'')
        }

        return driver
    }

}