import { ObjectId } from "mongodb";
import Model, { BaseModelData } from "../../../../base/Model";
import MongoDB from "../services/MongoDB";

export default class HasMany<
    LocalData extends BaseModelData,
    LocalModel extends Model<LocalData>,
    ForeignData extends BaseModelData
> 
{ 
    public async handle(localModel: LocalModel, foreignCollection: string, foreignKey: keyof ForeignData, localKey: keyof LocalData): Promise<ForeignData[] | null>
    {
        if(localKey instanceof ObjectId) {
            localKey = localKey.toString()
        }

        return await MongoDB.getInstance()
            .getDb()
            ?.collection(foreignCollection)
            .find({ [foreignKey]: localModel.getAttribute(localKey) })
            .toArray() as ForeignData[] | null
    }
}   