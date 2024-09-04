import { IHasMany, IHasManyOptions } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import IModelData from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";

export default class HasMany implements IHasMany
{ 
    public async handle<T = IModelData>(connection: string, options: IHasManyOptions): Promise<T[]>
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
            [foreignKey]: localKeyValue,
        }

        return await App.container('db')
            .documentManager(connection) 
            .table(new foreignModelCtor().table)
            .findMany(schema)
    }
}   