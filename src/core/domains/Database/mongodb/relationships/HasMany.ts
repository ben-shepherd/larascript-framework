import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";
import IModelData from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";
import { ObjectId } from "mongodb";

export type HasManyOptions = {
    localModel: IModel<IModelData>
    localKey: keyof IModelData
    foreignModelCtor: ModelConstructor<IModel<IModelData>>
    foreignKey: keyof IModelData
    filters?: object
}

export default class HasMany 
{ 
    public async handle({
        localModel,
        localKey,
        foreignModelCtor,
        foreignKey,
        filters = {}
    }: HasManyOptions)
    {
        const schema = {
            ...filters,
            ...this.buildIdFindSchema({
                localModel,
                localKey,
                foreignKey
            })
        }

        return await App.container('mongodb')
            .getDb()
            ?.collection(new foreignModelCtor().collection)
            .find(schema)
            .toArray()
    }

    /**
     * Converts ID to ObjectId if valid
     * Query performs on foreignKey checking for both string and ObjectId
     * 
     * @param {HasManyOptions} options
     * @returns
     */
    private buildIdFindSchema = ({ localModel, localKey, foreignKey }: Pick<HasManyOptions, 'localModel' | 'localKey' | 'foreignKey'>) => {
        let localKeyValue = localModel.getAttribute(localKey);

        let idFindSchema = {
            [foreignKey]: localKeyValue
        }
        
        if(typeof localKeyValue === 'string' && ObjectId.isValid(localKeyValue)) {
            localKeyValue = new ObjectId(localKeyValue);
        }

        if(localKeyValue instanceof ObjectId) {
            idFindSchema = {
                "$or": [
                    {
                        [foreignKey]: localKeyValue
                    },
                    {
                        [foreignKey]: localKeyValue.toString()
                    }
                ]
            }
        }

        return idFindSchema
    }
}   