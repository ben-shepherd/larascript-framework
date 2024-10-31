import { IBroadcaster } from "../domains/broadcast/interfaces/IBroadcaster";
import IHasObserver, { ObserveConstructor } from "../domains/observer/interfaces/IHasObserver";
import { IObserver, IObserverEvent } from "../domains/observer/interfaces/IObserver";
import { ICtor } from "../interfaces/ICtor";
import IModelAttributes from "../interfaces/IModelData";
import OnAttributeChangeBroadcastEvent, { OnAttributeChangeBroadcastEventPayload } from "./HasAttributes/OnAttributeChangeBroadcastEvent";
import SetAttributeBroadcastEvent from "./HasAttributes/SetAttributeBroadcastEvent";

const HasObserver = (Broadcaster: ICtor<IBroadcaster>) => {
    return class HasObserverMixin extends Broadcaster implements IHasObserver {

        constructor() {
            super()

            this.subscribeToBroadcastListener(this.constructor.name, OnAttributeChangeBroadcastEvent.eventName, async (payload) => await this.onAttributeChange(payload))
        }

        /**
         * The observer instance attached to this model.
         * If not set, observeWith must be called to define it.
         */
        public observer?: IObserver;

        /**
         * Custom observation methods for specific properties.
         * Key is the property name, value is the name of the custom observation method.
         */
        public observeProperties: Record<string, string> = {};

        /**
         * Called when a HasAttributeBroadcastEvent is triggered from a model with the HasAttributes concern.
         * 
         * @param {OnAttributeChangeBroadcastEventPayload} event - The event payload
         * @param {string} event.key - The key of the attribute that changed
         * @param {any} event.value - The new value of the attribute
         * @param {IModelAttributes} event.attributes - The attributes of the model that triggered the event
         * 
         * If the key is part of the observeProperties object, the method will call the associated custom observation method on the observer.
         * The result of the custom observation method is then passed to the setAttribute method to update the attribute on the model.
         * 
         * @returns {void}
         */
        // eslint-disable-next-line no-unused-vars
        async onAttributeChange ({ key, value, attributes }: OnAttributeChangeBroadcastEventPayload): Promise<void> {
            if(Object.keys(this.observeProperties).includes(key)) {

                const data = await this.observeDataCustom<IModelAttributes>(this.observeProperties[key] as keyof IObserver, value)

                this.broadcast(
                    new SetAttributeBroadcastEvent({
                        key,
                        value: data
                    })
                )
            }
        }
    
        /**
         * Attatch the Observer to this instance
         * @param observedBy The constructor of the observer to attach.
         * @throws {Error} If the observer is already attached.
         */
        observeWith (observedBy: ObserveConstructor<unknown>): void {
            if(this.observer) {
                throw new Error('Observer is already defined')
            }
            this.observer = new observedBy();
        }
    
        /**
         * Data has changed
         * Pass it through the appropriate method, return the data
         * 
         * Example
         *      this data = this.observer.on('updating', data)
         * 
         * @param name The name of the event to call on the observer.
         * @param data The data associated with the event.
         * @returns The processed data, or the original data if no observer is defined.
         */
        async observeData (name: IObserverEvent, data: any): Promise<unknown> {
            if(!this.observer) {
                return data
            }
            return await this.observer.on(name, data)
        }
    
        /**
         * A custom observer method
         * 
         * Example: 
         *      this.data = this.observeDataCustom('onPasswordChanged', this.data)
         * 
         * @param customName The name of the custom event to call on the observer.
         * @param data The data associated with the event.
         * @returns The processed data, or the original data if no observer is defined.
         */
        async observeDataCustom<T = unknown>(customName: keyof IObserver, data: any): Promise<T> {
            if(!this.observer) {
                return data
            }
            return this.observer.onCustom(customName as string, data)
        }
    
    }
    
}

export default HasObserver