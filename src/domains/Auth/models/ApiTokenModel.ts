import { IModel } from "../../../interfaces/IModel";
import Model from "../../../base/Model";
import { ApiToken } from "../types/types.t";

export default class ApiTokenModel extends Model implements IModel {
    collection = "apiTokens";

    constructor(data: ApiToken | null) {
        super(data);
    }
}