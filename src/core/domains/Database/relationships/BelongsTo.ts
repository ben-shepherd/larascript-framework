import { IBelongsTo, IBelongsToOptions } from "@src/core/domains/database/interfaces/relationships/IBelongsTo";
import IModelData from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";

export default class BelongsTo implements IBelongsTo
{ 
    public async handle<T = IModelData>(connection: string, options: IBelongsToOptions): Promise<T>
    {
        const {
            localModel,
            localKey,
            foreignModelCtor,
            foreignKey,
            filters = {}
        } = options

        let localKeyValue = localModel.getAttribute(localKey);

        const schema = { 
            ...filters,
            [foreignKey]: localKeyValue
         }

        return App.container('db')
            .documentManager(connection)
            .table(new foreignModelCtor().table)
            .findOne(schema) as T
    }
}   