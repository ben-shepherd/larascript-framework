import User from '@src/app/models/auth/User';
import Model from '@src/core/base/Model';
import IApiTokenModel, { IApiTokenData } from '@src/core/domains/auth/interfaces/IApitokenModel';
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel';

class ApiToken extends Model<IApiTokenData> implements IApiTokenModel {

    /**
     * Required ApiToken fields: userId, token, revokeAt
     */
    public fields: string[] = [
        'userId',
        'token',
        'revokedAt'
    ]

    public timestamps: boolean = false;

    /**
     * Finds the related user for this ApiToken
     * @returns 
     */
    public async user(): Promise<IUserModel | null> {
        return this.belongsTo<IUserModel>({
            localKey: 'userId',
            localModel: this,
            foreignKey: 'id',
            foreignModelCtor: User
        })
    }   

}

export default ApiToken