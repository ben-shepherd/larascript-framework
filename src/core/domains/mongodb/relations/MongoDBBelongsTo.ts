import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IBelongsTo, IBelongsToOptionsLegacy } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import DocumentValidator from "@src/core/domains/database/validator/DocumentValidator";
import { App } from "@src/core/services/App";
import { ObjectId } from "mongodb";

/**
 * Handles "belongs to" relationship for MongoDB.
 * This class is responsible for executing the query that retrieves the related document.
 */
export default class MongoDBBelongsTo implements IBelongsTo {

    /**
     * Document validator instance.
     * Used to validate the document before executing the query.
     */
    protected validator = new DocumentValidator();

    /**
     * Executes the query that retrieves the related document.
     * @param connection - The connection name.
     * @param document - The source document.
     * @param options - The relationship options.
     * @returns The related document or null if not found.
     */
    public async handle<T>(connection: string, document: IDatabaseDocument, options: IBelongsToOptionsLegacy): Promise<T | null> {
        const {
            foreignTable,
            filters: filtersOptions = {}
        } = options
        let {
            localKey,
            foreignKey,
        } = options

        /**
         * Get the value of the local key.
         * If the local key is "id", we use "_id" instead.
         */
        const localKeyValue = document[localKey];
        if(localKey === 'id') {
            localKey = '_id';
        }
        if(foreignKey === 'id') {
            foreignKey = '_id';
        }

        /**
         * Build the filter for the query.
         * If the local key value is a string and is a valid ObjectId,
         * we use the "$or" operator to search for the value as a string or as an ObjectId.
         */
        let filter = {};

        if(typeof localKeyValue === 'string' && ObjectId.isValid(localKeyValue)) {
            filter = {
                "$or": [
                    {
                        [foreignKey]: localKeyValue
                    },
                    {
                        [foreignKey]: new ObjectId(localKeyValue)
                    }
                ]
            }
        }
        else {
            filter = {
                [foreignKey]: localKeyValue
            }
        }

        /**
         * Merge the filter with the filters options.
         */
        filter = {
            ...filtersOptions,
            ...filter
        }
        
        /**
         * Get the document manager instance for the foreign table.
         */
        const documentManager = App.container('db')
            .documentManager(connection)
            .table(foreignTable);

        /**
         * Execute the query and return the related document or null if not found.
         */
        return await documentManager.findOne({ filter }) as T | null;
    }

}

