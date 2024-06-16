export type EventListenerConstructor<EventListener> = new (...args: any[]) => EventListener;

export interface IEventListener {
    handle: (...args: any[]) => any;
}