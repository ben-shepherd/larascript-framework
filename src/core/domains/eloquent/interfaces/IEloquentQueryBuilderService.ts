/* eslint-disable no-unused-vars */
import { IEloquent } from "@src/core/domains/eloquent/interfaces/IEloquent";
import { IModel } from "@src/core/domains/models/interfaces/IModel";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";

export interface IEloquentQueryBuilderService {
    builder<Model extends IModel>(modelCtor: TClassConstructor<Model>, connectionName?: string): IEloquent<Model>;
}