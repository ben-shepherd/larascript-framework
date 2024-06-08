import Model from '../../../base/Model';
import { IModel } from '../../../interfaces/IModel';
import { BaseUserData } from '../types/types.t';

export default class BaseUserModel<D extends BaseUserData = BaseUserData> extends Model<BaseUserData> implements IModel {
    collection = "users";

    fields: string[] = [
        'email',
        'hashedPassword',
        'roles',
    ]

    guarded: string[] = [
        'hashedPassword',
        'roles',
    ]

    constructor(data: D | null) {
        super(data ?? {} as D);
    }

    public hasRole(role: string) {
        const user = this?.data as D | null;

        if(!user) return;

        return user.roles.includes(role);
    }
}