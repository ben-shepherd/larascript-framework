import Model, { BaseModelData } from "@src/core/base/Model";
import { App } from "@src/core/services/App";
import { ObjectId } from "mongodb";

export default class BelongsTo<
    LocalData extends BaseModelData,
    LocalModel extends Model<LocalData>,
    ForeignData extends BaseModelData
> 
{ 
    public async handle(
        localModel: LocalModel,
        foreignCollection: string,
        foreignKey: keyof ForeignData,
        localKey: keyof LocalData,
        filters: object = {}
    ): Promise<ForeignData | null>
    {
        if(localKey instanceof ObjectId) {
            localKey = localKey.toString()
        }

        const schema = { 
            ...filters,
            [foreignKey]: localModel.getAttribute(localKey),
         }

        return await App.container('mongodb')
            .getDb()
            .collection(foreignCollection)
            .findOne(schema) as ForeignData | null
    }
}   