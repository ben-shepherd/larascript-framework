import { App } from "@src/core/services/App";
import { ObjectId } from "mongodb";
import Model, { BaseModelData } from "../../../../base/Model";

export default class HasOne<
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
            [foreignKey]: localModel.getAttribute(localKey)
        }

        const document = await App.container('mongodb')
            .getDb()
            ?.collection(foreignCollection)
            .findOne(schema)

        return document as ForeignData ?? null
    }
}   