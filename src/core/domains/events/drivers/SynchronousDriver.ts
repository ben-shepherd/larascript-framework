import eventsConfig from '@src/config/events';
import { IEvent } from '../interfaces/IEvent';
import IEventDriver from '../interfaces/IEventDriver';

export default class SynchronousDriver implements IEventDriver
{
    /**
     * Run all the events immediatly 
     * @param event 
     */
    async handle(event: IEvent) {
        const eventName = event.name
        const { payload } = event
        
        console.log(`[SynchronousDriver:runEventListeners] ${eventName as string}`, payload)

        const listeners = eventsConfig.eventWatcher[eventName as string] ?? []

        for(const listenerCtor of listeners) {
        console.log('[SynchronousDriver:listener] ', listenerCtor, { payload: event.payload })

            const listener = new listenerCtor();
            await listener.handle(event.payload);
        }
    }
}