import { IBroadcaster } from "@src/core/domains/broadcast/interfaces/IBroadcaster";
import OnAttributeChangeBroadcastEvent from "@src/core/events/concerns/HasAttribute/OnAttributeChangeBroadcastEvent";
import SetAttributeBroadcastEvent, { SetAttributeBroadcastEventPayload } from "@src/core/events/concerns/HasAttribute/SetAttributeBroadcastEvent";
import { IHasAttributes, IHasAttributesSetAttributeOptions as SetAttributeOptions } from "@src/core/interfaces/concerns/IHasAttributes";
import { ICtor } from "@src/core/interfaces/ICtor";
import IModelAttributes from "@src/core/interfaces/IModelData";

/**
 * Concern that adds the ability to set and retrieve attributes from a model, and to broadcast when attributes change.
 * The concern is a mixin and can be applied to any class that implements the IBroadcaster interface.
 * The concern adds the following methods to the class: setAttribute, getAttribute, getAttributes, getOriginal, isDirty, and getDirty.
 * The concern also adds a constructor that subscribes to the SetAttributeBroadcastEvent and calls the onSetAttributeEvent method when the event is triggered.
 * The concern is generic and can be used with any type of model attributes.
 * @template Attributes The type of the model's attributes.
 * @param {ICtor<IBroadcaster>} Base The base class to extend with the concern.
 * @returns {ICtor<IBroadcaster & IHasAttributes>} A class that extends the base class with the concern.
 */
const HasAttributesConcern = <Attributes extends IModelAttributes>(Base: ICtor<IBroadcaster>) => {
    return class HasAttributes extends Base implements IHasAttributes {

        constructor() {
            super();
            
            this.subscribeToBroadcastListener(
                this.constructor.name,
                SetAttributeBroadcastEvent.eventName,
                async (payload) => await this.onSetAttributeEvent(payload)
            );
        }
        attributes: IModelAttributes | null;
        original: IModelAttributes | null;



        /**
         * Called when a SetAttributeBroadcastEvent is triggered from a model with the HasAttributes concern.
         * Sets the value of the attribute in the model's data without broadcasting the change.
         * 
         * @param {SetAttributeBroadcastEventPayload} payload - The event payload
         * @param {string} payload.key - The key of the attribute to set
         * @param {any} payload.value - The value to set for the attribute
         * 
         * @returns {void}
         */
        private async onSetAttributeEvent(payload: SetAttributeBroadcastEventPayload): Promise<void> {
            await this.setAttribute(payload.key, payload.value, { broadcast: false });
        }
    
        /**
         * Sets or retrieves the value of a specific attribute from the model's data.
         * If called with a single argument, returns the value of the attribute.
         * If called with two arguments, sets the value of the attribute.
         * If the value is not set, returns null.
         * 
         * @template K Type of the attribute key.
         * @param {K} key - The key of the attribute to retrieve or set.
         * @param {any} [value] - The value to set for the attribute.
         * @returns {Attributes[K] | null | undefined} The value of the attribute or null if not found, or undefined if setting.
         */
        async attrSync<K extends keyof Attributes = keyof Attributes>(key: K, value?: unknown): Promise<Attributes[K] | null | undefined> {
            if (value === undefined) {
                return this.getAttributeSync(key) as Attributes[K] ?? null;
            }

            await this.setAttribute(key, value);
            return undefined;
        }
    
        /**
         * Sets the value of a specific attribute in the model's data.
         * 
         * @template K Type of the attribute key.
         * @param {K} key - The key of the attribute to set.
         * @param {any} value - The value to set for the attribute.
         * @throws {Error} If the attribute is not in the allowed fields or if a date field is set with a non-Date value.
         */
        async setAttribute<K extends keyof Attributes = keyof Attributes>(key: K, value?: unknown, options?: SetAttributeOptions): Promise<void> {
            if (this.attributes === null) {
                this.attributes = {} as Attributes;
            }
            if (this.attributes) {
                this.attributes[key] = value as Attributes[K];
            }

            if(options && !options.broadcast) {
                return; 
            }
            
            await this.broadcast( 
                new OnAttributeChangeBroadcastEvent({
                    key: key as string,
                    value,
                    attributes: this.attributes
                })
            );
        }
    
        /**
         * Retrieves the value of a specific attribute from the model's data.
         * 
         * @template K Type of the attribute key.
         * @param {K} key - The key of the attribute to retrieve.
         * @returns {Attributes[K] | null} The value of the attribute or null if not found.
         */
        getAttributeSync<K extends keyof Attributes = keyof Attributes>(key: K): Attributes[K] | null {
            return this.attributes?.[key] ?? null;
        }

        /**
         * Retrieves the entire model's data as an object.
         * 
         * @returns {IModelAttributes | null} The model's data as an object, or null if no data is set.
         */
        getAttributes(): IModelAttributes | null {
            return this.attributes;
        }
    
        /**
         * Retrieves the original value of a specific attribute from the model's original data.
         * 
         * @template K Type of the attribute key.
         * @param {K} key - The key of the attribute to retrieve.
         * @returns {Attributes[K] | null} The original value of the attribute or null if not found.
         */
        getOriginal<K extends keyof Attributes = keyof Attributes>(key: K): Attributes[K] | null {
            return this.original?.[key] ?? null;
        }
    
        /**
         * Checks if the model is dirty.
         * 
         * A model is considered dirty if any of its attributes have changed since the last time the model was saved.
         * 
         * @returns {boolean} True if the model is dirty, false otherwise.
         */
        isDirty(): boolean {
            if(!this.original) {
                return false;
            }
            return Object.keys(this.getDirty() ?? {}).length > 0;
        }

        /**
         * Gets the dirty attributes.
         * @returns 
         */
        getDirty(): Record<keyof Attributes, any> | null {

            const dirty = {} as Record<keyof Attributes, any>;

            Object.entries(this.attributes as object).forEach(([key, value]) => {

                try {
                    if (typeof value === 'object' && JSON.stringify(value) !== JSON.stringify(this.original?.[key])) {
                        dirty[key as keyof Attributes] = value;
                        return;
                    }
                }
                // eslint-disable-next-line no-unused-vars
                catch (e) { }

                if (value !== this.original?.[key]) {
                    dirty[key as keyof Attributes] = value;
                }
            });

            return dirty;
        }
    
    }
}

export default HasAttributesConcern