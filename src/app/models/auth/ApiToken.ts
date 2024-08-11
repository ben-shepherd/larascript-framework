import BaseApiTokenModel from '@src/core/domains/auth/models/BaseApiTokenModel';
import { BaseApiTokenData } from '@src/core/domains/auth/types/Types.t';
import { ObjectId } from 'mongodb';
import User, { UserData } from './User';

export interface ApiTokenData extends BaseApiTokenData {
    _id?: ObjectId
    userId: ObjectId
    token: string
    revokedAt: Date | null;
}

export default class ApiToken extends BaseApiTokenModel<ApiTokenData> {

    constructor(data: ApiTokenData | null = null) {
        super(data);
    }

    /**
     * Finds the related user for this ApiToken
     * @returns 
     */
    public async user(): Promise<User | null> {
        return await this.belongsTo<ApiTokenData, ApiToken, UserData, User>(this, 'userId', User, new User().primaryKey);
    }   

}
