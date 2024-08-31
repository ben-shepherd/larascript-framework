import IModelData from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";
import { IHasMany, IHasManyOptions } from "@src/core/domains/database/interfaces/relationships/IHasMany";

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
            .query(connection) 
            .table(new foreignModelCtor().collection)
            .findMany(schema)
    }
}   