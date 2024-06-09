import BaseUserModel from '../../core/domains/auth/models/BaseUserModel'
import { UserData } from '../interfaces/UserData';

export default class User extends BaseUserModel<UserData> {

    /**
     * Protected fields
     */
    guarded: string[] = [];

    /**
     * Define your user fields that can be set
     */
    fields: string[] = [
        ...this.fields,
        /** Define your user fields below */
        'firstName',
        'lastName'
    ]

    constructor(data: UserData | null = null) {
        super(data);
    }
}