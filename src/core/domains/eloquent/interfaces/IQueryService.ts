/* eslint-disable no-unused-vars */
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";

import { IEloquent } from "./IEloquent";

export interface IQueryService {
    builder<Model extends IModel, Attributes extends Model['attributes'] = Model['attributes']>(modelCtor: ICtor<Model>): IEloquent<Model>;
}