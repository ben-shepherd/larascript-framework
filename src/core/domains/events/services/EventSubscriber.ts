import EventSubscriberException from "@src/core/domains/events/exceptions/EventSubscriberException";
import { IEvent } from "@src/core/domains/events/interfaces/IEvent";
import { IEventDrivers, ISubscribers } from '@src/core/domains/events/interfaces/IEventConfig';
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";

/**
 * EventSubscriber
 *
 * Represents an event and its handler.
 *
 * @template Payload type of the event payload
 * @template Watchters object with event names as keys and event listener classes as values
 * @template Drivers object with driver names as keys and the driver classes as values
 */
export default class EventSubscriber<
    Payload extends IEventPayload,
    Watchters extends ISubscribers = ISubscribers,
    Drivers extends IEventDrivers = IEventDrivers
> implements IEvent<Payload, Watchters, Drivers> {

    /**
     * Name of the event
     */
    public name: keyof Watchters & string;

    /**
     * Name of the event driver
     */
    public driver: keyof Drivers;

    /**
     * Payload of the event
     */
    public payload: Payload;

    /**
     * Constructor
     * 
     * @param name name of the event
     * @param driver name of the event driver
     * @param payload payload of the event
     */
    constructor(name: keyof Watchters & string, driver: keyof Drivers, payload: Payload) {
        this.name = name;
        this.driver = driver;
        this.payload = payload;

        if(!this.name) {
            throw new EventSubscriberException('EventSubscriber must have a \'name\' property')
        }
        if(!this.driver) {
            throw new EventSubscriberException('EventSubscriber must have a \'driver\' property')
        }
    }

}
