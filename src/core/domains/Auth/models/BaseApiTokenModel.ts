import Model from "@src/core/base/Model";
import BaseUserModel from '@src/core/domains/auth/models/BaseUserModel';
import { BaseApiTokenData } from '@src/core/domains/auth/types/Types.t';
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
        return this.belongsTo({
            localKey: 'userId',
            localModel: this,
            foreignKey: '_id',
            foreignModelCtor: BaseUserModel
        })
    }
}