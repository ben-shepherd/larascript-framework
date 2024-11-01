import { IEvent } from '@src/core/domains/events-legacy/interfaces/IEvent';
import IEventDriver from '@src/core/domains/events-legacy/interfaces/IEventDriver';
import { App } from '@src/core/services/App';

/**
 * Synchronous event driver
 *
 * This driver will process events synchronously as soon as they are dispatched.
 */
export default class SynchronousDriver implements IEventDriver {

    /**
     * Process an event synchronously
     *
     * @param event The event to process
     */
    async handle(event: IEvent) {
        const eventName = event.name

        // Get all the listeners with this eventName
        const listenerConstructors = App.container('events').getListenersByEventName(eventName)

        // Process each listener synchronously
        for (const listenerCtor of listenerConstructors) {
            const listener = new listenerCtor();
            await listener.handle(event.payload);
        }
    }

}
