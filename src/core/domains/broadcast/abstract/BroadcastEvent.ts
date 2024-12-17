import { ICtor } from "@src/core/interfaces/ICtor";

import { IBroadcastListener } from "../interfaces/IBroadcaster";

/**
 * Abstract base class for events that can be broadcasted.
 * 
 * This class serves as a base for creating events that can be broadcasted to communicate changes or actions between different parts of an application. 
 * It helps decouple the components by allowing them to listen for and respond to specific events, rather than relying on direct method calls. 
 * This is particularly useful in systems where multiple components need to be notified about changes or actions, such as in an observer pattern implementation.
 *
 * @template Payload The type of the payload of the event.
 */
abstract class BroadcastListener<Payload extends object> implements IBroadcastListener<Payload> {

    /**
     * The payload of the event.
     */
    payload!: Payload;

    /**
     * @param payload The payload of the event.
     */
    constructor(payload: Payload) {
        this.payload = payload
    }

    /**
     * @returns The name of the event as a string.
     */
    static getName(): string {
        return new (this as unknown as ICtor<IBroadcastListener>)({}).getListenerName()
    }

    /**
     * @returns The name of the event.
     */
    abstract getListenerName(): string;

    /**
     * @template T The type of the payload to return.
     * @returns The payload of the event.
     */
    getPayload(): Payload {
        return this.payload
    }
        
    
}

export default BroadcastListener