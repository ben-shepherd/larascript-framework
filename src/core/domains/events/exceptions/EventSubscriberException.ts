export default class EventSubscriberException extends Error {
    constructor(message: string = 'Event Subscriber Exception') {
        super(message);
        this.name = 'EventSubscriberException';
    }
}