import { ObjectId } from "mongodb";
import Model, { BaseModelData } from "../../../../base/Model";
import MongoDB from "../services/MongoDB";

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

        return await MongoDB.getInstance()
            .getDb()
            .collection(foreignCollection)
            .findOne(schema) as ForeignData | null
    }
}   