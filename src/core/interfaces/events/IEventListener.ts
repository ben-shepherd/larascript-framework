export type EventListenerConstructor<EventListener> = new (...args: any[]) => IEventListener;

export interface IEventListener {
    handle: (...args: any[]) => any;
}