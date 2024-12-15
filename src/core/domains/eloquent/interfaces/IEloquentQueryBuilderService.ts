/* eslint-disable no-unused-vars */
import { IEloquent } from "@src/core/domains/eloquent/interfaces/IEloquent";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";

export interface IEloquentQueryBuilderService {
    builder<Model extends IModel>(modelCtor: ICtor<Model>): IEloquent<Model>;
}