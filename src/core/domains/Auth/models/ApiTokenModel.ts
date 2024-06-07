import Model from "../../../base/Model";
import { IModel } from "../../../interfaces/IModel";
import { ApiTokenData } from "../types/types.t";

export default class ApiTokenModel extends Model<ApiTokenData> implements IModel {
    collection = "apiTokens";

    constructor(data: ApiTokenData | null) {
        super(data);
    }
}