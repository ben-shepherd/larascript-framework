import { IHasMany, IHasManyOptions } from "@src/core/domains/database/interfaces/relationships/IHasMany";
import IModelData from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";
import { ObjectId } from "mongodb";

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
        } = options;

        const schema = {
            ...filters,
            ...this.buildIdFindSchema({
                localModel,
                localKey,
                foreignKey
            })
        }

        return await App.container('db')
            .query(connection) 
            .table(new foreignModelCtor().table)
            .findMany(schema)
    }

    /**
     * Converts ID to ObjectId if valid
     * Query performs on foreignKey checking for both string and ObjectId
     * 
     * @param {HasManyOptions} options
     * @returns
     */
    private buildIdFindSchema = ({ localModel, localKey, foreignKey }: Pick<IHasManyOptions, 'localModel' | 'localKey' | 'foreignKey'>) => {
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