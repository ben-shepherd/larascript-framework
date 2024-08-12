import Model, { BaseModelData } from "@src/core/base/Model";
import { ModelConstructor } from "@src/core/interfaces/IModel";
import { App } from "@src/core/services/App";
import { ObjectId } from "mongodb";

export type BelongsToOptions = {
    localModel: Model<BaseModelData>;
    localKey: keyof BaseModelData;
    foreignModelCtor: ModelConstructor<Model<BaseModelData>>,
    foreignKey: keyof BaseModelData;
    filters?: object;
}

export default class BelongsTo 
{ 
    public async handle({
        localModel,
        localKey,
        foreignModelCtor,
        foreignKey,
        filters = {}
    }: BelongsToOptions)
    {
        let localKeyValue = localModel.getAttribute(localKey);

        if(typeof localKeyValue === 'string' && ObjectId.isValid(localKeyValue)) {
            localKeyValue = new ObjectId(localKeyValue);
        }

        const schema = { 
            ...filters,
            [foreignKey]: localKeyValue
         }

        return await App.container('mongodb')
            .getDb()
            .collection(new foreignModelCtor().collection)
            .findOne(schema);
    }
}   