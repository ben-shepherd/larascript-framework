import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import { app } from "@src/core/services/App";

import { IEloquent } from "../interfaces/IEloquent";
import { IQueryService } from "../interfaces/IQueryService";

class EloquentQueryService implements IQueryService {

    /**
     * Creates a new query builder instance for the model.
     * @param modelCtor The constructor of the model to query.
     * @returns A query builder instance associated with the model.
     */
    builder<Model extends IModel, Attributes extends Model['attributes'] = Model['attributes']>(modelCtor: ICtor<Model>): IEloquent<Attributes> {
        const model = new modelCtor(null)
        
        const eloquentCtor = app('db')
            .getAdapter(model.connection)
            .getEloquentCtor<Attributes>()

        return new eloquentCtor()
            .setConnectionName(model.connection)
            .setModelCtor(modelCtor)
            .setModelColumns(modelCtor)
            .setTable(model.useTableName())
    }

}

export default EloquentQueryService;