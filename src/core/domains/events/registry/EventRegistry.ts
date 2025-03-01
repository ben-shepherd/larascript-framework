import { ICtor } from "@src/core/interfaces/ICtor";

import { IBaseEvent } from "../interfaces/IBaseEvent";

/**
 * A static registry for events that can work before the event service is available
 */
class EventRegistry {

    private static events: Set<ICtor<IBaseEvent>> = new Set();

    private static initialized = false;

    /**
     * Register an event constructor
     */
    static register(eventCtor: ICtor<IBaseEvent>): ICtor<IBaseEvent> {
        this.events.add(eventCtor);
        return eventCtor;
    }

    /**
     * Register many event constructors
     */
    static registerMany(eventCtors: ICtor<IBaseEvent>[]): void {
        eventCtors.forEach(eventCtor => this.register(eventCtor));
    }

    /**
     * Get all registered events
     */
    static getEvents(): ICtor<IBaseEvent>[] {
        return Array.from(this.events);
    }

    /**
     * Check if registry has been initialized
     */
    static isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Mark registry as initialized
     */
    static setInitialized(): void {
        this.initialized = true;
    }

    /**
     * Clear the registry
     */
    static clear(): void {
        this.events.clear();
        this.initialized = false;
    }

}

export default EventRegistry; 