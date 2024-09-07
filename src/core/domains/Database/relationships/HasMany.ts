import { IHasMany, IHasManyOptions } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import IModelData from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";

import { IDatabaseDocument } from "../interfaces/IDocumentManager";

export default class HasMany implements IHasMany {

    public async handle<T = IModelData>(connection: string, document: IDatabaseDocument, options: IHasManyOptions): Promise<T> {
        const {
            localKey,
            foreignKey,
            foreignTable,
            filters = {}
        } = options

        if (!document[localKey]) {
            throw new Error(`Document must have a ${localKey} property`)
        }

        const documentManager = App.container('db')
            .documentManager(connection)
            .table(foreignTable)

        const localKeyValue = document[localKey]

        const schema = {
            ...filters,
            [foreignKey]: localKeyValue,
        }

        return await documentManager.findMany({ filter: schema }) as T
    }

}       