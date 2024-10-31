import { IBroadcastEvent } from "../interfaces/IBroadcastEvent";

abstract class BroadcastEvent implements IBroadcastEvent {

    protected payload!: unknown;

    /**
     * Constructor
     *
     * @param payload The payload of the event.
     */
    constructor(payload: unknown) {
        this.payload = payload
    }

    /**
     * Returns the name of the event.
     *
     * @returns The name of the event.
     */
    abstract getEventName(): string;

    /**
     * Returns the payload of the event.
     *
     * @template T The type of the payload to return.
     * @returns The payload of the event.
     */
    getPayload<T = unknown>(): T {
        return this.payload as T
    }
        
    
}

export default BroadcastEvent