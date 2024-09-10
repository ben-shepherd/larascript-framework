import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IHasMany, IHasManyOptions } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import IModelData from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";
import { ObjectId } from "mongodb";

export default class HasMany implements IHasMany {
 
    public async handle<T = IModelData>(connection: string, document: IDatabaseDocument, options: IHasManyOptions): Promise<T[]> {
        const {
            foreignTable,
            filters = {}
        } = options
        let {
            localKey,
            foreignKey,
        } = options;

        if(localKey === 'id') {
            localKey = '_id';
        }
        if(foreignKey === 'id') {
            foreignKey = '_id';
        }

        if (!document[localKey]) {
            throw new Error(`Document must have a ${localKey} property`)
        }
        
        const schema = {
            ...filters,
            ...this.buildFilters(document, {
                localKey,
                foreignKey
            })
        }

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
        
        if(typeof localKeyValue === 'string' && ObjectId.isValid(localKeyValue)) {
            localKeyValue = new ObjectId(localKeyValue);
        }

        if(localKeyValue instanceof ObjectId) {
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