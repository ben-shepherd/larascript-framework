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
    creating(data: ReturnType): ReturnType {
        return data;
    }

    /**
     * Called when a 'created' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    created(data: ReturnType): ReturnType {
        return data;
    }

    /**
     * Called when an 'updating' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    updating(data: ReturnType): ReturnType {
        return data;
    }

    /**
     * Called when an 'updated' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    updated(data: ReturnType): ReturnType {
        return data;
    }

    /**
     * Called when a 'saving' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    saving(data: ReturnType): ReturnType {
        return data;
    }

    /**
     * Called when a 'saved' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    saved(data: ReturnType): ReturnType {
        return data;
    }

    /**
     * Called when a 'deleting' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    deleting(data: ReturnType): ReturnType {
        return data;
    }

    /**
     * Called when a 'deleted' event is triggered.
     * 
     * @param data - The data associated with the event
     * @returns The processed data, or the original data if no handler is found
     */
    deleted(data: ReturnType): ReturnType {
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
    on(name: IObserverEvent, data: ReturnType): ReturnType {
        if (this[name] && typeof this[name] === 'function') {
            // Call the method associated with the event name
            return (this[name] as (data: ReturnType, ...args: any[]) => ReturnType)(data);
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
    onCustom(customName: string, data: ReturnType, ...args: any[]): ReturnType {
    // Attempt to find a method on this instance with the given custom name
        const method = this[customName as keyof this] as ((data: ReturnType, ...args: any[]) => ReturnType) | undefined;
        
        if (method && typeof method === 'function') {
            // If a matching method is found and it's a function, call it
            return method.apply(this, [data, ...args]);
        }
        
        // If no matching method is found, return the original data unchanged
        return data;
    }

}
