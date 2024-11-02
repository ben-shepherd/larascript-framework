import SyncDriver from "@src/core/domains/events/drivers/SyncDriver";
import { IBaseEvent } from "@src/core/domains/events/interfaces/IBaseEvent";
import IEventDriver from "@src/core/domains/events/interfaces/IEventDriver";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";
import { ICtor } from "@src/core/interfaces/ICtor";

abstract class BaseEvent implements IBaseEvent {

    protected payload: IEventPayload | null = null;

    protected driver!: ICtor<IEventDriver>;

    /**
     * Constructor
     * @param payload The payload of the event
     * @param driver The class of the event driver
     */
    constructor(driver: ICtor<IEventDriver> = SyncDriver, payload: IEventPayload | null = null) {
        this.payload = payload;
        this.driver = driver;
    }
    
    // eslint-disable-next-line no-unused-vars
    async execute(...args: any[]): Promise<void> {

        /* Nothing to execute*/
    }

    getPayload<T = unknown>(): T {
        return this.payload as T
    }

    /**
     * Returns the name of the event.
     * 
     * @returns The name of the event as a string.
     */
    getName(): string {
        return this.constructor.name
    }

    /**
     * @returns The event driver constructor.
     */
    getDriverCtor(): ICtor<IEventDriver> {        
        return this.driver;
    }

}

export default BaseEvent