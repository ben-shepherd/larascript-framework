import eventsConfig from "@src/config/events";
import Singleton from "../../../base/Singleton";
import { IEvent } from "../interfaces/IEvent";
import { IEventDriverOptions } from "../interfaces/IEventConfig";
import { IEventDispatcher } from "../interfaces/IEventDispatcher";
import { IEventPayload } from "../interfaces/IEventPayload";

export default class EventDispatcher extends Singleton<typeof eventsConfig> implements IEventDispatcher {

    /**
     * Handle the dispatched event
     * @param event 
     */
    public async dispatch<Payload extends IEventPayload>(event: IEvent<Payload>) 
    {
        console.log(`[EventDispatcher:dispatch] Event '${event.name}' with driver '${event.driver}'`)

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
    protected getDriverOptionsFromEvent(event: IEvent): IEventDriverOptions
    {
        const driver = eventsConfig.drivers[event.driver]

        if(!driver) {
            throw new Error('Driver not found \'' + event.driver + '\'')
        }

        return driver
    }
}