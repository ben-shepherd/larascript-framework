import { IObserver, IObserverEvent } from "@src/core/domains/observer/interfaces/IObserver";

/**
 * Abstract class implementing the Observer pattern.
 * Classes extending this class will have event handlers for the following events:
 * - creating
 * - created
 * - updating
 * - updated
 * - saving
 * - saved
 * - deleting
 * - deleted
 * 
 * These event handlers can be overridden to provide custom logic for handling these events.
 * 
 * Additionally, the class provides methods for handling custom events that are not part of the predefined set.
 */
export default abstract class Observer<ReturnType = any> implements IObserver<ReturnType> {

    /**
     * Called when a 'creating' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    async creating(data: ReturnType): Promise<ReturnType> {
        return data;
    }

    /**
     * Called when a 'created' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    async created(data: ReturnType): Promise<ReturnType> {
        return data;
    }

    /**
     * Called when an 'updating' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    async updating(data: ReturnType): Promise<ReturnType> {
        return data;
    }

    /**
     * Called when an 'updated' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    async updated(data: ReturnType): Promise<ReturnType> {
        return data;
    }

    /**
     * Called when a 'saving' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    async saving(data: ReturnType): Promise<ReturnType> {
        return data;
    }

    /**
     * Called when a 'saved' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    async saved(data: ReturnType): Promise<ReturnType> {
        return data;
    }

    /**
     * Called when a 'deleting' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    async deleting(data: ReturnType): Promise<ReturnType> {
        return data;
    }

    /**
     * Called when a 'deleted' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    async deleted(data: ReturnType): Promise<ReturnType> {
        return data;
    }

    /**
     * Handles predefined observer events.
     * This method is called when a known event occurs and routes the data
     * through the appropriate event handler method.
     * 
     * @param name - The name of the event to handle (must be a key of IObserver)
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     * 
     * @example
     * // Inside some method of a class extending Observer
     * this.data = this.on('updating', this.data);
     */
    async on(name: IObserverEvent, data: ReturnType): Promise<ReturnType> {
        if (this[name] && typeof this[name] === 'function') {
            // Call the method associated with the event name
            // eslint-disable-next-line no-unused-vars
            return await (this[name] as (data: ReturnType, ...args: any[]) => ReturnType)(data);
        }
        // If no method is found or it's not a function, return the original data
        return data;
    }

    /**
     * Handles custom observer events that are not part of the predefined set.
     * This method allows for extension of the observer pattern with custom events.
     * 
     * @param customName - The name of the custom event to handle
     * @param data - The data associated with the custom event
     * @returns The processed data, or the original data if no handler is found
     * 
     * @example
     * // Inside some method of a class extending Observer
     * this.data = this.onCustom('onPasswordChange', this.data, optionalParameter);
     */
    async onCustom(customName: string, data: ReturnType, ...args: any[]): Promise<ReturnType> {
    // Attempt to find a method on this instance with the given custom name
        // eslint-disable-next-line no-unused-vars
        const method = this[customName as keyof this] as ((data: ReturnType, ...args: any[]) => ReturnType) | undefined;
        
        if (method && typeof method === 'function') {
            // If a matching method is found and it's a function, call it
            return method.apply(this, [data, ...args]);
        }
        
        // If no matching method is found, return the original data unchanged
        return data;
    }

}
