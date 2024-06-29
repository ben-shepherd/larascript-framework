import { App } from "@src/core/services/App";
import Singleton from "../../../base/Singleton";
import { IEvent } from "../interfaces/IEvent";
import { IDriverConfig } from "../interfaces/IEventConfig";
import { IEventDispatcher } from "../interfaces/IEventDispatcher";
import { IEventPayload } from "../interfaces/IEventPayload";


export default class EventDispatcher extends Singleton implements IEventDispatcher {

    public className: string = 'EventDispatcher';
    
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
    protected getDriverOptionsFromEvent(event: IEvent): IDriverConfig
    {
        const driver = App.container('events').config.drivers[event.driver]

        if(!driver) {
            throw new Error('Driver not found \'' + event.driver + '\'')
        }

        return driver
    }
}