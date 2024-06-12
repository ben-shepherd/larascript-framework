import BaseUserModel from '../../../core/domains/auth/models/BaseUserModel';
import { ApiTokenData } from '../../interfaces/ApiTokenData';
import { UserData } from '../../interfaces/UserData';
import ApiToken from './ApiToken';

export default class User extends BaseUserModel<UserData> {

    /**
     * Protected fields
     */
    guarded: string[] = [
        ...this.guarded
    ];

    /**
     * Define your user fields that can be set
     */
    fields: string[] = [
        ...this.fields,
        /** Define your user fields below */
        'firstName',
        'lastName',
        'lastLoginAt'
    ]

    constructor(data: UserData | null = null) {
        super(data);
    }

    public async tokens(): Promise<ApiToken[]> {
        return await this.hasMany<UserData, User, ApiTokenData, ApiToken>(this, '_id', ApiToken, new ApiToken().USER_ID);
    }
}