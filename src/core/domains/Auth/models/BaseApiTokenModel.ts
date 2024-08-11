import Model from "@src/core/base/Model";
import BaseUserModel from '@src/core/domains/auth/models/BaseUserModel';
import { BaseApiTokenData, BaseUserData } from '@src/core/domains/auth/types/types.t';
import { IModel } from "@src/core/interfaces/IModel";

export default class BaseApiTokenModel<Data extends BaseApiTokenData = BaseApiTokenData> extends Model<Data> implements IModel {
    collection = "apiTokens";

    timestamps = false

    fields = [
        'userId',
        'token',
        'revokedAt',
    ]

    public async user(): Promise<BaseUserModel | null>
    {
        return this.belongsTo<
            BaseApiTokenData,
            BaseApiTokenModel,
            BaseUserData,
            BaseUserModel
        >(
            this,
            'userId',
            BaseUserModel,
            '_id'
        )
    }
}