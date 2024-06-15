import Model from "@src/core/base/Model";
import { IModel } from "@src/core/interfaces/IModel";
import { BaseApiTokenData, BaseUserData } from '../types/types.t';
import BaseUserModel from './BaseUserModel';

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