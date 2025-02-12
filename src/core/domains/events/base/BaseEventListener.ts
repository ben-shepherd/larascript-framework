import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventListener } from "@src/core/domains/events/interfaces/IEventListener";
import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";
import { IBaseListener } from "@src/core/domains/events/interfaces/IBaseEvent";

class BaseEventListener<TPayload = unknown> extends BaseEvent<TPayload> implements IEventListener<TPayload>, IBaseListener<TPayload> {

    type: 'listener' = 'listener';

    /**
     * Constructor
     *
     * Creates a new instance of the event listener and dispatches the event to
     * all subscribers.
     *
     * @param payload The payload of the event to dispatch
     */
    constructor(payload?: TPayload, driver?: ICtor<IEventDriver>) {
        super(payload, driver);

        if(!App.containerReady('events')) {
            return;
        }
    }

}

export default BaseEventListener