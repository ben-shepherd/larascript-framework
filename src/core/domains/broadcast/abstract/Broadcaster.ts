import { IBroadcastListener, IBroadcastListenerConstructor, IBroadcastListenerOptions, IBroadcastSubscribeOptions, IBroadcaster } from "@src/core/domains/broadcast/interfaces/IBroadcaster";

/**
 * Abstract base class for broadcasting events and subscribing to them.
 */
abstract class Broadcaster implements IBroadcaster {

    protected broadcastListeners: IBroadcastListenerOptions[] = [];

    getListeners(): IBroadcastListenerOptions[] {
        return this.broadcastListeners
    }
    
    async broadcastDispatch(listener: IBroadcastListener): Promise<void> {
        const listenerConstructor = listener.constructor as IBroadcastListenerConstructor
        const listenerName = listener.getListenerName()

        const subscribers = this.getListeners().filter(subscriber => subscriber.name === listenerName)

        for(const subscriber of subscribers) { 

            await subscriber.callback(listener.getPayload())

            if(subscriber.once) {
                this.broadcastUnsubscribe({ listener: listenerConstructor })
            }
        }
    }

    broadcastSubscribe<Listener extends IBroadcastListener>(options: IBroadcastSubscribeOptions<Listener>) {
        const { listener, callback, once = false } = options
        const name = listener.getName()

        this.broadcastListeners.push({
            name,
            callback,
            once
        })
    }

    broadcastSubscribeOnce<Listener extends IBroadcastListener>(options: IBroadcastSubscribeOptions<Listener>) {
        this.broadcastSubscribe({ ...options, once: true })
    }

    broadcastUnsubscribe(options: Omit<IBroadcastSubscribeOptions, 'callback'>) {
        const name = options.listener.getName()
        this.broadcastListeners = this.broadcastListeners.filter(listener => listener.name !== name)
    }

}

export default Broadcaster