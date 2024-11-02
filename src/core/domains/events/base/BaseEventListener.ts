import { IEventListener } from "@src/core/domains/events/interfaces/IEventListener";
import BaseEvent from "@src/core/domains/events/base/BaseEvent";

class BaseEventListener extends BaseEvent implements IEventListener {

    constructor() {
        super();
        this.notifySubscribers();
    }

    // eslint-disable-next-line no-unused-vars
    async dispatch(...arg: any[]): Promise<void> { /* Nothing to dispatch */ }

    protected notifySubscribers() {
        
    }

}

export default BaseEventListener