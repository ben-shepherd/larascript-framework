import { IEvent } from '@src/core/domains/events/interfaces/IEvent';
import IEventDriver from '@src/core/domains/events/interfaces/IEventDriver';
import { App } from '@src/core/services/App';

export default class SynchronousDriver implements IEventDriver
{
    /**
     * Run all the events immediatly 
     * @param event 
     */
    async handle(event: IEvent) {
        const eventName = event.name

        // Get all the listeners with this eventName
        const listenerConstructors = App.container('events').getListenersByEventName(eventName)

        // Process immediatly
        for(const listenerCtor of listenerConstructors) {
            const listener = new listenerCtor();
            await listener.handle(event.payload);
        }
    }
}