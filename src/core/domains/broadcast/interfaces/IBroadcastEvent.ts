export interface IBroadcastEvent 
{
    getEventName(): string;

    getPayload<T = unknown>(): T;
}