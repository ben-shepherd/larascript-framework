import { ApiTokenData } from '@src/app/interfaces/auth/ApiTokenData';
import { UserData } from '@src/app/interfaces/auth/UserData';
import BaseApiTokenModel from '@src/core/domains/auth/models/BaseApiTokenModel';
import User from './User';

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
