import { IBroadcaster } from "@src/core/domains/broadcast/interfaces/IBroadcaster";
import IHasObserver, { ObserveConstructor } from "@src/core/domains/observer/interfaces/IHasObserver";
import { IObserver, IObserverEvent } from "@src/core/domains/observer/interfaces/IObserver";
import { ICtor } from "@src/core/interfaces/ICtor";
import IModelAttributes from "@src/core/interfaces/IModelData";
import { z } from "zod";

import AttributeChangeListener, { AttributeChangePayload } from "../models/broadcast/AttributeChangeListener";

/**
 * Attaches an observer to a model.
 * 
 * The observer is an instance of a class that implements the IObserver interface.
 * The observer is responsible for handling events that are broadcasted from the model.
 * The observer can also be used to handle custom events that are not part of the predefined set.
 * 
 * The HasObserverConcern adds the following methods to the model:
 * - onAttributeChange: Called when a HasAttributeBroadcastEvent is triggered from a model with the HasAttributes concern.
 * - observeWith: Attatch the Observer to this instance.
 * - observeData: Data has changed, pass it through the appropriate method, return the data.
 * - observeDataCustom: A custom observer method.
 * 
 * @param Broadcaster The class that implements the IBroadcaster interface. This class is responsible for broadcasting events to the observer.
 * @returns A class that extends the Broadcaster class and implements the IHasObserver interface.
 */
const HasObserverConcern = (Broadcaster: ICtor<IBroadcaster>) => {
    return class HasObserver extends Broadcaster implements IHasObserver {

        constructor() {
            super()

            this.broadcastSubscribe<AttributeChangeListener>({
                listener: AttributeChangeListener,
                callback: async (payload) => await this.onAttributeChange(payload)
            })
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
         * @param {Payload} event - The event payload
         * @param {string} event.key - The key of the attribute that changed
         * @param {any} event.value - The new value of the attribute
         * @param {IModelAttributes} event.attributes - The attributes of the model that triggered the event
         * 
         * If the key is part of the observeProperties object, the method will call the associated custom observation method on the observer.
         * The result of the custom observation method is then passed to the setAttribute method to update the attribute on the model.
         * 
         * @returns {void}
         */
         
        async onAttributeChange ({ key, value, attributes }: AttributeChangePayload): Promise<void> {
            if(Object.keys(this.observeProperties).includes(key)) {

                const schema = z.object({
                    key: z.string(),
                    value: z.any(),
                    attributes: z.object({})
                })
                schema.parse({ key, value, attributes })

                const data = await this.observeDataCustom<IModelAttributes>(this.observeProperties[key] as keyof IObserver, value)

                this.broadcastDispatch(
                    new AttributeChangeListener({
                        key,
                        value: data,
                        attributes
                    })
                );
            }
        }
    
        /**
         * Attatch the Observer to this instance
         * @param observedBy The constructor of the observer to attach.
         * @throws {Error} If the observer is already attached.
         */
        observeWith (observedBy: ObserveConstructor<unknown>, allowOverride: boolean = false): void {
            if(!allowOverride && this.observer) {
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

export default HasObserverConcern