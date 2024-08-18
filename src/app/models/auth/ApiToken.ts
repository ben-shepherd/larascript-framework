import Model from '@src/core/base/Model';
import IApiTokenModel from '@src/core/domains/auth/interfaces/IApitokenModel';
import { ObjectId } from 'mongodb';
import User from './User';

export interface ApiTokenData {
    _id?: ObjectId
    userId: ObjectId
    token: string
    revokedAt: Date | null;
}

export default class ApiToken extends Model<ApiTokenData> implements IApiTokenModel<ApiTokenData> {

    constructor(data: ApiTokenData | null = null) {
        super(data);
    }

    /**
     * Finds the related user for this ApiToken
     * @returns 
     */
    public async user(): Promise<User | null> {
        return this.belongsTo({
            localKey: 'userId',
            localModel: this,
            foreignKey: '_id',
            foreignModelCtor: User
        })
    }   

}
