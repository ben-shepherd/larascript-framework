import Model from "@src/core/base/Model";
import { IModel } from "@src/core/interfaces/IModel";
import { BaseApiTokenData } from "../types/types.t";

export default class BaseApiTokenModel<Data extends BaseApiTokenData = BaseApiTokenData> extends Model<Data> implements IModel {
    collection = "apiTokens";

    timestamps = false

    fields = [
        'userId',
        'token',
        'revokedAt',
    ]
}