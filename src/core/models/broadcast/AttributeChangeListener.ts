import BroadcastListener from "@src/core/domains/broadcast/abstract/BroadcastEvent";
import { IModelAttributes } from "@src/core/domains/models/interfaces/IModel";

export type AttributeChangePayload = {
    key: string;
    value: unknown;
    attributes: IModelAttributes;
}

/**
 * Event payload for attribute change events.
 * @typedef {Object} AttributeChangePayload
 * @property {string} key - The key of the attribute that changed.
 * @property {unknown} value - The new value of the attribute.
 * @property {IModelAttributes} attributes - The current attributes of the model.
 */
class AttributeChangeListener extends BroadcastListener<AttributeChangePayload> {

    getListenerName(): string {
        return 'onAttributeChange'
    }

    getPayload() {
        return this.payload
    }

}

export default AttributeChangeListener