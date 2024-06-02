import { IModel } from "../../../interfaces/IModel";
import BaseModel from "../../../models/BaseModel";
import { ApiToken } from "../types/types.t";

export default class ApiTokenModel extends BaseModel implements IModel {
    collection = "apiTokens";

    constructor(data: ApiToken | null) {
        super(data);
    }
}