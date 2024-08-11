import Model from '@src/core/base/Model';
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel';
import BaseApiTokenModel from '@src/core/domains/auth/models/BaseApiTokenModel';
import { BaseApiTokenData, BaseUserData } from '@src/core/domains/auth/types/Types.t';

interface TokensOptions {
    activeOnly: boolean
}
const TokenOptionsDefault = {
    activeOnly: false
}

export default class BaseUserModel<UserData extends BaseUserData = BaseUserData> extends Model<UserData> implements IUserModel{
    collection = "users";

    fields: string[] = [
        'email',
        'hashedPassword',
        'roles',
        'createdAt',
        'updatedAt'
    ]

    dates = [
        'updatedAt',
        'createdAt'
    ]

    guarded: string[] = [
        'hashedPassword',
        'roles',
    ]

    /**
     * Check if a user has a role
     * @param role 
     * @returns 
     */
    public hasRole(role: string) {
        const user = this?.data;

        if(!user) return;

        return user.roles.includes(role);
    }

    /**
     * Tokens associated to the user
     * @returns 
     */
    async tokens({ activeOnly }: TokensOptions = TokenOptionsDefault): Promise<BaseApiTokenModel[]> {
        const filters: {revokedAt?: null} = {}

        if(activeOnly) {
            filters.revokedAt = null
        }

        return this.hasMany<BaseUserData, BaseUserModel, BaseApiTokenData, BaseApiTokenModel>(
            this,
            this.primaryKey,
            BaseApiTokenModel,
            'userId',
            filters
        )
    }
}