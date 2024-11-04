import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventService } from "@src/core/domains/events/interfaces/IEventService";
import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";

import EventInvalidPayloadException from "../exceptions/EventInvalidPayloadException";
import { TISerializablePayload } from "../interfaces/IEventPayload";

abstract class BaseEvent<TPayload = TISerializablePayload> implements IBaseEvent<TPayload> {

    protected payload: TPayload | null = null;

    protected driver!: ICtor<IEventDriver>;

    protected defaultDriver!: ICtor<IEventDriver>;

    /**
     * Provide a namespace to avoid conflicts with other events.
     */
    protected namespace: string = '';

    /**
     * Constructor
     * @param payload The payload of the event
     * @param driver The class of the event driver
     */
    constructor(payload: TPayload | null = null, driver?: ICtor<IEventDriver>) {
        this.payload = payload;

        // Use safeContainer here to avoid errors during registering which runs during boot up.
        this.defaultDriver = App.safeContainer('events')?.getDefaultDriverCtor() as ICtor<IEventDriver>; 
        this.driver = driver ?? this.defaultDriver;

        // Ensure the payload is valid
        if(!this.validatePayload()) {
            throw new EventInvalidPayloadException('Invalid payload. Must be JSON serializable.');
        }
    }

    /**
     * Validates the payload of the event. Ensures that the payload is an object with types that match:
     * string, number, boolean, object, array, null.
     * @throws {EventInvalidPayloadException} If the payload is invalid.
     */
    validatePayload(): boolean {
        try {
            JSON.stringify(this.payload);
        }
        // eslint-disable-next-line no-unused-vars
        catch (err) {
            return false   
        }
        
        return true
    }

    /**
     * Gets the event service that handles event dispatching and listener registration.
     * @returns The event service.
     */
    getEventService(): IEventService {
        return App.container('events');
    }
    
    // eslint-disable-next-line no-unused-vars
    async execute(...args: any[]): Promise<void> {/* Nothing to execute */}

    /**
     * @returns The name of the queue as a string.
     */
    getQueueName(): string {
        return 'default';
    }

    /**
     * @template T The type of the payload to return.
     * @returns The payload of the event.
     */
    getPayload<T extends TPayload>(): T {
        return this.payload as T
    }

    /**
     * @returns The name of the event as a string.
     */
    getName(): string {
        const prefix = this.namespace === '' ? '' : (this.namespace + '/')
        return prefix + this.constructor.name
    }

    /**
     * @returns The event driver constructor.
     */
    getDriverCtor(): ICtor<IEventDriver> {        
        return this.driver ?? this.defaultDriver;
    }

}

export default BaseEvent