import { IHasPrepareDocument } from "@src/core/interfaces/concerns/IHasPrepareDocument";
import { ICtor } from "@src/core/interfaces/ICtor";

/**
 * Concern providing a method to prepare a document for saving to the database.
 * 
 * Automatically stringifies any fields specified in the `json` property.
 * 
 * @example
 * class MyModel extends BaseModel {
 *     json = ['options'];
 * }
 * 
 * @template T The type of the prepared document.
 * @returns {T} The prepared document.
 */
const HasPrepareDocumentConcern = (Base: ICtor) => {
    return class HasPrepareDocument extends Base implements IHasPrepareDocument {

        /**
         * List of fields that should be treated as JSON.
         * These fields will be automatically stringified when saving to the database.
         */
        public json: string[] = [];


        /**
         * Prepares the document for saving to the database.
         * Handles JSON stringification for specified fields.
         * 
         * @template T The type of the prepared document.
         * @returns {T} The prepared document.
         */
        prepareDocument<T>(): T {
            return this.getDocumentManager().prepareDocument({ ...this.attributes }, {
                jsonStringify: this.json
            }) as T;
        }
    
    }
}

export default HasPrepareDocumentConcern