import Model from '../../../base/Model';
import { IModel } from '../../../interfaces/IModel';
import { BaseUserData } from '../types/types.t';

export default class BaseUserModel<UserData extends BaseUserData = BaseUserData> extends Model<UserData> implements IModel {
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

    constructor(data: UserData | null) {
        super(data ?? {} as UserData);
    }

    public hasRole(role: string) {
        const user = this?.data;

        if(!user) return;

        return user.roles.includes(role);
    }
}