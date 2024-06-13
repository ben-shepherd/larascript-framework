import Model from "../../../base/Model";
import { IModel } from "../../../interfaces/IModel";
import { BaseApiTokenData } from "../types/types.t";

export default class BaseApiTokenModel<D extends BaseApiTokenData = BaseApiTokenData> extends Model<D> implements IModel {
    collection = "apiTokens";

    constructor(data: D | null) {
        super(data);
    }
}