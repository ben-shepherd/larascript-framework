import EventSubscriber from "@src/core/domains/events/services/EventSubscriber";

export default class TestQueueSubscriber extends EventSubscriber<any> {
    
    constructor(payload: any) {
        const eventName = 'TestQueueEvent'
        const driver = 'testing';

        super(eventName, driver, payload)
    }
}