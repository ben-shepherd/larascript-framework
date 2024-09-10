import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IBelongsTo, IBelongsToOptions } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import DocumentValidator from "@src/core/domains/database/validator/DocumentValidator";
import { App } from "@src/core/services/App";
import { ObjectId } from "mongodb";

export default class MongoDBBelongsTo implements IBelongsTo {
 
    protected validator = new DocumentValidator();

    public async handle<T>(connection: string, document: IDatabaseDocument, options: IBelongsToOptions): Promise<T | null> {
        const {
            foreignTable,
            filters: filtersOptions = {}
        } = options
        let {
            localKey,
            foreignKey,
        } = options

        const localKeyValue = document[localKey];
        
        if(localKey === 'id') {
            localKey = '_id';
        }
        if(foreignKey === 'id') {
            foreignKey = '_id';
        }

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

        filter = {
            ...filtersOptions,
            ...filter
        }
        
        const documentManager = App.container('db')
            .provider(connection)
            .documentManager()
            .table(foreignTable);

        return await documentManager.findOne({ filter }) as T | null;
    }

}   