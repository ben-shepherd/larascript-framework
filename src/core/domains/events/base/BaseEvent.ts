import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";
import { IEventService } from "@src/core/domains/events/interfaces/IEventService";
import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";

abstract class BaseEvent implements IBaseEvent {

    protected payload: IEventPayload | null = null;

    protected driver!: ICtor<IEventDriver>;

    protected defaultDriver!: ICtor<IEventDriver>;

    /**
     * Constructor
     * @param payload The payload of the event
     * @param driver The class of the event driver
     */
    constructor(payload: IEventPayload | null = null, driver?: ICtor<IEventDriver>) {
        this.payload = payload;
        this.defaultDriver = App.container('events').getDefaultDriverCtor();
        this.driver = driver ?? this.defaultDriver;
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
     * @template T The type of the payload to return.
     * @returns The payload of the event.
     */
    getPayload<T = unknown>(): T {
        return this.payload as T
    }

    /**
     * @returns The name of the event as a string.
     */
    getName(): string {
        return this.constructor.name
    }

    /**
     * @returns The event driver constructor.
     */
    getDriverCtor(): ICtor<IEventDriver> {        
        return this.driver ?? this.defaultDriver;
    }

}

export default BaseEvent