/* eslint-disable no-unused-vars */
import { IEloquent } from "@src/core/domains/eloquent/interfaces/IEloquent";
import { IModel } from "@src/core/domains/models/interfaces/IModel";
import { ICtor } from "@src/core/interfaces/ICtor";

export interface IEloquentQueryBuilderService {
    builder<Model extends IModel>(modelCtor: ICtor<Model>, connectionName?: string): IEloquent<Model>;
}