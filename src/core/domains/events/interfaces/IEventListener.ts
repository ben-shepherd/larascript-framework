export type EventListenerConstructor<EventListener extends IEventListener = IEventListener> = new (...args: any[]) => EventListener;

export interface IEventListener {
    handle: (...args: any[]) => any;
}