import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IBelongsTo, IBelongsToOptions } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import IModelAttributes from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";

/**
 * Handles "belongs to" relationship
 *
 * @class
 * @implements {IBelongsTo}
 */
export default class BelongsTo implements IBelongsTo {

    /**
     * Executes the query that retrieves the related document.
     * @param connection - The connection name.
     * @param document - The source document.
     * @param options - The relationship options.
     * @returns The related document or null if not found.
     */
    public async handle<T = IModelAttributes>(connection: string, document: IDatabaseDocument, options: IBelongsToOptions): Promise<T | null> {

        /**
         * Get the local key and foreign key from the options.
         * If the local key is "id", we use "_id" instead.
         * If the foreign key is "id", we use "_id" instead.
         */
        const {
            localKey,
            foreignKey,
            foreignTable,
            filters = {}
        } = options

        /**
         * Check if the document has the local key.
         * If not, throw an error.
         */
        if(!document[localKey]) {
            throw new Error(`Document must have a ${localKey} property`)
        }

        /**
         * Get the document manager for the foreign table.
         */
        const documentManager = App.container('db')
            .documentManager(connection)
            .table(foreignTable)

        /**
         * Get the value of the local key.
         */
        const localKeyValue = document[localKey];

        /**
         * Build the filter for the query.
         * Add the filter from the options to the filter.
         * Add the foreign key to the filter with the value of the local key.
         */
        const schema = { 
            ...filters,
            [foreignKey]: localKeyValue
        }

        /**
         * Execute the query.
         * Return the related document or null if not found.
         */
        return await documentManager.findOne({ filter: schema }) as T ?? null
    }

}


