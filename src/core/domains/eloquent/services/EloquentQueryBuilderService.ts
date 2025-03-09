import { IEloquent } from "@src/core/domains/eloquent/interfaces/IEloquent";
import { IEloquentQueryBuilderService } from "@src/core/domains/eloquent/interfaces/IEloquentQueryBuilderService";
import { IModel, ModelConstructor } from "@src/core/domains/models/interfaces/IModel";
import { app } from "@src/core/services/App";

/**
 * Shorthand function to create a new query builder instance for the model.
 * @param modelCtor 
 * @returns 
 */
export const queryBuilder = <Model extends IModel>(modelCtor: ModelConstructor<Model>, connectionName?: string): IEloquent<Model> => app('query').builder(modelCtor, connectionName);

/**
 * Eloquent query service
 */
class EloquentQueryBuilderService implements IEloquentQueryBuilderService {

    /**
     * Creates a new query builder instance for the model.
     * @param modelCtor The constructor of the model to query.
     * @returns A query builder instance associated with the model.
     */
    builder<Model extends IModel>(modelCtor: ModelConstructor<Model>, connectionName?: string): IEloquent<Model> {
        
        const model = new modelCtor(null)
        const tableName = modelCtor.getTable()
        const connection = connectionName ?? modelCtor.getConnectionName()
        
        const eloquentConstructor = app('db')
            .getAdapter(connection)
            .getEloquentConstructor<Model>()

        return new eloquentConstructor()
            .setConnectionName(connection)
            .setModelCtor(modelCtor)
            .setModelColumns(modelCtor)
            .setTable(tableName)
            .setIdGenerator(model.getIdGeneratorFn());
    }

}

export default EloquentQueryBuilderService;