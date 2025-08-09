import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import { IBaseListener } from "@src/core/domains/events/interfaces/IBaseEvent";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventListener } from "@src/core/domains/events/interfaces/IEventListener";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";

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
    constructor(payload?: TPayload, driver?: TClassConstructor<IEventDriver>) {
        super(payload, driver);
    }

}

export default BaseEventListener