import EventSubscriber from "@src/core/domains/events/services/EventSubscriber";

export default class TestSubscriber extends EventSubscriber<any> {
    
    constructor(payload: any) {
        const eventName = 'TestEvent'
        const driver = 'sync';

        super(eventName, driver, payload)
    }
}