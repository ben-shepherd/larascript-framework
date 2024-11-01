 


export interface IHasPrepareDocument {

    /**
     * List of fields that should be treated as JSON.
     * These fields will be automatically stringified when saving to the database.
     */
    json: string[];

    /**
     * Prepares the document for saving to the database.
     * Handles JSON stringification for specified fields.
     * 
     * @template T The type of the prepared document.
     * @returns {T} The prepared document.
     */
    prepareDocument<T>(): T;
}