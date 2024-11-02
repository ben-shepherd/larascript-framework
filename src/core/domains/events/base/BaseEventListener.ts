import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import { IEventListener } from "@src/core/domains/events/interfaces/IEventListener";

class BaseEventListener extends BaseEvent implements IEventListener {

    constructor() {
        super();
        this.notifySubscribers();
    }


    // eslint-disable-next-line no-unused-vars
    async dispatch(...arg: any[]): Promise<void> { /* Nothing to dispatch */ }

    protected notifySubscribers() {
        const eventService = this.getEventService();
        const subscribers = this.getSubscribers();

        for (const subscriber of subscribers) {
            eventService.dispatch(new subscriber);
        }
    }

}

export default BaseEventListener