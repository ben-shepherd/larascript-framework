/* eslint-disable no-unused-vars */
export type BroadcastCallback<Payload = unknown> = (payload: Payload) => Promise<void>;

export type IBroadcastListenerOptions = {
    name: string;
    callback: BroadcastCallback;
    once?: boolean;
}

export interface IBroadcastListenerConstructor {
    new (...args: any[]): IBroadcastListener;
    getName(): string;
}


export interface IBroadcastSubscribeOptions<Listener extends IBroadcastListener = IBroadcastListener, Payload = unknown> {
    id?: string;
    listener: IBroadcastListenerConstructor;
    callback: BroadcastCallback<Listener['payload']>;
    once?: boolean;
}

export interface IBroadcaster {
    getListeners(): IBroadcastListenerOptions[];
    broadcastDispatch(listener: IBroadcastListener): Promise<void>;
    broadcastSubscribe<Listener extends IBroadcastListener>(options: IBroadcastSubscribeOptions<Listener>);
    broadcastSubscribeOnce<Listener extends IBroadcastListener>(options: IBroadcastSubscribeOptions<Listener>);
    broadcastUnsubscribe(options: IBroadcastSubscribeOptions);
}

export interface IBroadcastListener<Payload = unknown> {
    payload: Payload;
    getListenerName(): string;
    getPayload(): Payload;
}