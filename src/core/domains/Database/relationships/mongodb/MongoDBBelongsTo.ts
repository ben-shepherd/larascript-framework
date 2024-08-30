import IModelData from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";
import { ObjectId } from "mongodb";
import { IBelongsTo, IBelongsToOptions } from "../../interfaces/relationships/IBelongsTo";

export default class MongoDBBelongsTo implements IBelongsTo
{ 
    public async handle<T = IModelData>(connection: string, options: IBelongsToOptions): Promise<T>
    {
        let {
            localModel,
            localKey,
            foreignModelCtor,
            foreignKey,
            filters = {}
        } = options

        let localKeyValue = localModel.getAttribute(localKey);

        if(typeof localKeyValue === 'string' && ObjectId.isValid(localKeyValue)) {
            localKeyValue = new ObjectId(localKeyValue);
        }

        if(foreignKey === 'id') {
            foreignKey = '_id'
        }

        const schema = { 
            ...filters,
            [foreignKey]: localKeyValue
         }

        return App.container('db')
            .query(connection)
            .table(new foreignModelCtor().collection)
            .findOne(schema) as T
    }
}   