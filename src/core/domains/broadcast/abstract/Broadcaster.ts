import { BroadcastCallback, IBroadcastListener, IBroadcaster } from "@src/core/domains/broadcast/interfaces/IBroadcaster";
import { IBroadcastEvent } from "@src/core/domains/broadcast/interfaces/IBroadcastEvent";

/**
 * Abstract base class for broadcasting events and subscribing to them.
 */
abstract class Broadcaster implements IBroadcaster {

    /**
     * Map of listeners. The keys are the names of the listeners, and the values are arrays of callbacks.
     * Each callback is executed when the listener is triggered.
     */
    protected broadcastListeners: Map<string, IBroadcastListener[]> = new Map();
    
    /**
     * Broadcast an event to all listeners that have subscribed to it.
     * If no listener exists for the given event, the method will return without doing anything.
     * @param name The name of the event to broadcast.
     * @param args The arguments to pass to the listeners.
     */
    async broadcast(event: IBroadcastEvent): Promise<void> {
        const eventName = event.getName()

        if(!this.broadcastListeners.has(eventName)) {
            this.createBroadcastListener(eventName)
        }

        const listeners = this.broadcastListeners.get(eventName) as IBroadcastListener[]

        for(const listener of listeners) { 
            await listener.callback(event.getPayload())
        }
    }

    /**
     * Creates a new broadcast listener with the given name. If the listener already exists, this method will do nothing.
     * @param eventName The name of the listener to create.
     */
    createBroadcastListener(eventName: string) {
        if(this.broadcastListeners.has(eventName)) {
            throw new Error(`Listener ${eventName} already exists`)
        }

        this.broadcastListeners.set(eventName, [])
    }

    /**
     * Subscribe to a broadcast listener. If the listener does not exist, this method will throw an error.
     * @param eventName The name of the listener to subscribe to.
     * @param callback The callback to be executed when the listener is triggered.
     */
    subscribeToBroadcastListener(id: string, eventName: string, callback: BroadcastCallback) {
        if(!this.broadcastListeners.has(eventName)) {
            this.createBroadcastListener(eventName)
        }

        const listener = this.broadcastListeners.get(eventName)
        
        listener?.push({ id, callback })
    }

    /**
     * Unsubscribe from a broadcast listener. If the listener does not exist, this method will do nothing.
     * @param id The id of the listener to unsubscribe.
     * @param eventName The name of the listener to unsubscribe from.
     */
    unsubscribeFromBroadcastListener(id: string, eventName: string) {
        if(!this.broadcastListeners.has(eventName)) {
            return;
        }

        const listeners = this.broadcastListeners.get(eventName)

        listeners?.splice(listeners.findIndex(listener => listener.id === id), 1)
    }

}

export default Broadcaster