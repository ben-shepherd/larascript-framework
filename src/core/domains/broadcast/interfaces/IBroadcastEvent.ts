export interface IBroadcastEvent 
{
    getName(): string;

    getPayload<T = unknown>(): T;
}