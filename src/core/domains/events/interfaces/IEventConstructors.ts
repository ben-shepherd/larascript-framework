/* eslint-disable no-unused-vars */
import { IBaseListener, IBaseSubscriber } from "./IBaseEvent";

export interface ListenerConstructor {
    new (...args: any[]): IBaseListener;
}

export interface SubscriberConstructor {
    new (...args: any[]): IBaseSubscriber;
}
