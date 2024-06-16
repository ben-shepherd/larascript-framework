import { IEvent } from "../interfaces/IEvent";
import { IEventDrivers, IEventWatcher } from '../interfaces/IEventConfig';
import { IEventPayload } from "../interfaces/IEventPayload";

export default abstract class Event<
    Payload extends IEventPayload,
    Watchters extends IEventWatcher = IEventWatcher,
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
            throw new Error('Event must have a \'name\' property')
        }
        if(!this.driver) {
            throw new Error('Event must have a \'driver\' property')
        }
    }
}