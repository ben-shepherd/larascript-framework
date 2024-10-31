/* eslint-disable no-unused-vars */
import { IBroadcastEvent } from "./IBroadcastEvent";

export type BroadcastEvent = Map<string, any[]>
export type BroadcastCallback = (...args: any[]) => Promise<void>;

export interface IBroadcastListener {
    id: string;
    callback: BroadcastCallback;
}

export interface IBroadcaster {

    broadcast(event: IBroadcastEvent): Promise<void>;

    createBroadcastListener(eventName: string);

    subscribeToBroadcastListener(id: string, eventName: string, callback: BroadcastCallback);

    unsubscribeFromBroadcastListener(id: string, eventName: string);
}