import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IHasMany, IHasManyOptions } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import IModelAttributes from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";

/**
 * Handles "has many" relationship.
 *
 * @class
 * @implements {IHasMany}
 */
export default class HasMany implements IHasMany {

    /**
     * Executes the query that retrieves the related documents.
     * 
     * @param {string} connection - The connection name.
     * @param {IDatabaseDocument} document - The source document.
     * @param {IHasManyOptions} options - The relationship options.
     * @returns {Promise<IModelAttributes[]>} The related documents.
     */
    public async handle<T = IModelAttributes>(connection: string, document: IDatabaseDocument, options: IHasManyOptions): Promise<T[]> {
        // Get the local key, foreign key, foreign table, and filters from the options.
        const {
            localKey,
            foreignKey,
            foreignTable,
            filters = {}
        } = options

        // Check if the document has the local key.
        if (!document[localKey]) {
            throw new Error(`Document must have a ${localKey} property`)
        }

        // Get the document manager for the foreign table.
        const documentManager = App.container('db')
            .documentManager(connection)
            .table(foreignTable)

        // Get the value of the local key.
        const localKeyValue = document[localKey]

        // Build the filter for the query.
        const schema = {
            ...filters,
            [foreignKey]: localKeyValue,
        }

        // Execute the query.
        return await documentManager.findMany({ filter: schema }) as T[]
    }

}
