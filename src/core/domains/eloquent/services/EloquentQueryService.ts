import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";
import { app } from "@src/core/services/App";

import { IEloquent } from "../interfaces/IEloquent";
import { IQueryService } from "../interfaces/IQueryService";

export const queryBuilder = <Model extends IModel>(modelCtor: ModelConstructor<Model>): IEloquent<Model> => app('query').builder(modelCtor);

class EloquentQueryService implements IQueryService {

    /**
     * Creates a new query builder instance for the model.
     * @param modelCtor The constructor of the model to query.
     * @returns A query builder instance associated with the model.
     */
    builder<Model extends IModel>(modelCtor: ModelConstructor<Model>): IEloquent<Model> {
        const model = new modelCtor(null)
        
        const eloquentCtor = app('db')
            .getAdapter(model.connection)
            .getEloquentConstructor<Model>()

        return new eloquentCtor()
            .setConnectionName(model.connection)
            .setModelCtor(modelCtor)
            .setModelColumns(modelCtor)
            .setTable(model.useTableName())
            .setFormatter((result) => modelCtor.create<Model>(result as Model['attributes'] | null))
            .setIdGenerator(model.getIdGeneratorFn());
    }

}

export default EloquentQueryService;