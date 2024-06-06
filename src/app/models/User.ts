import BaseUserModel from '../../core/domains/Auth/models/BaseUserModel'
import { UserData } from '../interfaces/UserData';

export default class User extends BaseUserModel<UserData> {

    fields: string[] = [
        ...this.fields,
        /** Define your user fields below */
    ]

    constructor(data: UserData | null) {
        super(data);
    }
}