import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IHasMany, IHasManyOptions } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import IModelAttributes from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";
import { ObjectId } from "mongodb";

/**
 * Handles "has many" relationship
 *
 * @class
 * @implements {IHasMany}
 */
export default class HasMany implements IHasMany {

    /**
     * Execute the query that retrieves the related documents.
     * 
     * @param {string} connection - The connection name.
     * @param {IDatabaseDocument} document - The source document.
     * @param {IHasManyOptions} options - The relationship options.
     * @returns {Promise<IModelAttributes[]>} The related documents.
     */
    public async handle<T = IModelAttributes>(connection: string, document: IDatabaseDocument, options: IHasManyOptions): Promise<T[]> {

        const {
            foreignTable,
            filters = {}
        } = options
        let {
            localKey,
            foreignKey,
        } = options;

        // If the local key is "id", we use "_id" instead.
        if (localKey === 'id') {
            localKey = '_id';
        }
        // If the foreign key is "id", we use "_id" instead.
        if (foreignKey === 'id') {
            foreignKey = '_id';
        }

        // Check if the document has the local key.
        if (!document[localKey]) {
            throw new Error(`Document must have a ${localKey} property`)
        }
        
        // Build the filter for the query.
        const schema = {
            ...filters,
            ...this.buildFilters(document, {
                localKey,
                foreignKey
            })
        }

        // Execute the query.
        return await App.container('db')
            .documentManager(connection) 
            .table(foreignTable)
            .findMany({ filter: schema })
    }

    /**
     * Creates an OR condition for both string and ObjectId, if applicable
     * 
     * @param {HasManyOptions} options
     * @returns
     */
    private buildFilters = (document: IDatabaseDocument, { localKey, foreignKey }: Pick<IHasManyOptions, 'localKey' | 'foreignKey'>) => {
        let localKeyValue = document[localKey];

        let filters = {
            [foreignKey]: localKeyValue
        }
        
        // If the local key value is a string and is a valid ObjectId, we use the "$or" operator to search for the value as a string or as an ObjectId.
        if (typeof localKeyValue === 'string' && ObjectId.isValid(localKeyValue)) {
            localKeyValue = new ObjectId(localKeyValue);
        }

        // If the local key value is an ObjectId, we use the "$or" operator to search for the value as an ObjectId or as a string.
        if (localKeyValue instanceof ObjectId) {
            filters = {
                "$or": [
                    {
                        [foreignKey]: localKeyValue
                    },
                    {
                        [foreignKey]: localKeyValue.toString()
                    }
                ]
            }
        }

        return filters
    }

}

