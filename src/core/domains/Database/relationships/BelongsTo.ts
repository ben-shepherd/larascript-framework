import { IBelongsTo, IBelongsToOptions } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import IModelData from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";
import { IDatabaseDocument } from "../interfaces/IDocumentManager";

export default class BelongsTo implements IBelongsTo
{ 
    public async handle<T = IModelData>(connection: string, document: IDatabaseDocument, options: IBelongsToOptions): Promise<T | null>
    {   
        const {
            localKey,
            foreignKey,
            foreignTable,
            filters = {}
        } = options

        const documentManager = App.container('db')
            .documentManager(connection)
            .table(foreignTable)

        if(!document[localKey]) {
            throw new Error(`Document must have a ${localKey} property`)
        }

        let localKeyValue = document[localKey];

        const schema = { 
            ...filters,
            [foreignKey]: localKeyValue
         }

         return await documentManager.findOne({ filter: schema }) as T ?? null
    }
}   