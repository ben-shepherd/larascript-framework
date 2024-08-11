import UserObserver from '@src/app/observers/UserObserver';
import BaseUserModel from '@src/core/domains/auth/models/BaseUserModel';
import { BaseUserData } from '@src/core/domains/auth/types/types.t';
import { ObjectId } from 'mongodb';

export interface UserData extends BaseUserData {
    _id?: ObjectId
    email: string
    hashedPassword: string
    roles: string[]
}

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
    ]

    constructor(data: UserData | null = null) {
        super(data);
        this.observeWith(UserObserver)
    }
}