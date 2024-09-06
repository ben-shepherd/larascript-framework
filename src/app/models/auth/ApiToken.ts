import Model from '@src/core/base/Model';
import IApiTokenModel, { IApiTokenData } from '@src/core/domains/auth/interfaces/IApitokenModel';
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel';
import User from './User';

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
    public async user(): Promise<IUserModel | null> 
    {
        return this.belongsTo(User, {
            localKey: 'userId',
            foreignKey: 'id',
        })
    }   

}

export default ApiToken