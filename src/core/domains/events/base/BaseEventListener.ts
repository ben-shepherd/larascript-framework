import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventListener } from "@src/core/domains/events/interfaces/IEventListener";
import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";

class BaseEventListener<TPayload = unknown> extends BaseEvent<TPayload> implements IEventListener<TPayload> {

    /**
     * Constructor
     *
     * Creates a new instance of the event listener and dispatches the event to
     * all subscribers.
     *
     * @param payload The payload of the event to dispatch
     */
    constructor(payload?: TPayload, driver?: ICtor<IEventDriver>) {
        super(payload, driver);

        if(!App.containerReady('events')) {
            return;
        }

        this.notifySubscribers();
    }

    /**
     * Notifies all subscribers of this event that the event has been dispatched.
     *
     * Retrieves all subscribers of this event from the event service, creates
     * a new instance of each subscriber, passing the payload of this event to
     * the subscriber's constructor, and then dispatches the subscriber event
     * using the event service.
     */
    protected notifySubscribers() {
        const eventService = this.getEventService();
        const subscribers = eventService.getSubscribers(this.getName());

        for (const subscriber of subscribers) {
            const subscriberEvent = new subscriber(this.getPayload());

            eventService.dispatch(subscriberEvent);
        }
    }

}

export default BaseEventListener