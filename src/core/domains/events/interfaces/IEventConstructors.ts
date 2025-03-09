/* eslint-disable no-unused-vars */
import { IBaseEvent, IBaseListener, IBaseSubscriber } from "@src/core/domains/events/interfaces/IBaseEvent";

export interface EventConstructor {
    new (...args: any[]): IBaseEvent;
}

export interface ListenerConstructor {
    new (...args: any[]): IBaseListener;
}

export interface SubscriberConstructor {
    new (...args: any[]): IBaseSubscriber;
}
