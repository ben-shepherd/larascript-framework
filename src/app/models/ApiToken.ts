import BaseApiTokenModel from '../../core/domains/auth/models/BaseApiTokenModel';
import { ApiTokenData } from '../interfaces/ApiTokenData';
import { UserData } from '../interfaces/UserData';
import User from './User';

export default class ApiToken extends BaseApiTokenModel<ApiTokenData> {

    constructor(data: ApiTokenData | null = null) {
        super(data);
    }

    public async user(): Promise<User | null> {
        return await this.belongsTo<ApiTokenData, ApiToken, UserData, User>(this, 'userId', User, new User().primaryKey);
    }   

}
