import Model from '@src/core/base/Model';
import { BaseUserData } from '../types/types.t';

export default class BaseUserModel<UserData extends BaseUserData = BaseUserData> extends Model<UserData> {
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
}