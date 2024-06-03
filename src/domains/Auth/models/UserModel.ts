import { IModel } from '../../../interfaces/IModel';
import BaseModel from '../../../models/BaseModel';
import { User } from '../types/types.t';

export default class UserModel extends BaseModel implements IModel {
    collection = "users";

    guarded: string[] = [
        'hashedPassword',
        'roles',
    ]

    constructor(data: User | null) {
        super(data);
    }

    public hasRole(role: string) {
        const user = this?.data as User | null;

        if(!user) return;

        return user.roles.includes(role);
    }
}