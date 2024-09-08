import EventSubscriberException from "@src/core/domains/events/exceptions/EventSubscriberException";
import { IEvent } from "@src/core/domains/events/interfaces/IEvent";
import { IEventDrivers, ISubscribers } from '@src/core/domains/events/interfaces/IEventConfig';
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";

export default class EventSubscriber<
    Payload extends IEventPayload,
    Watchters extends ISubscribers = ISubscribers,
    Drivers extends IEventDrivers = IEventDrivers
> implements IEvent<Payload, Watchters, Drivers> {

    public name: keyof Watchters & string;

    public driver: keyof Drivers;

    public payload: Payload;

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