import UserObserver from '@src/app/observers/UserObserver';

import { ApiTokenData } from '@src/app/interfaces/auth/ApiTokenData';
import { UserData } from '@src/app/interfaces/auth/UserData';
import BaseUserModel from '@src/core/domains/auth/models/BaseUserModel';
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
    ]

    constructor(data: UserData | null = null) {
        super(data);
        this.observeWith(UserObserver)
    }

    public async tokens(): Promise<ApiToken[]> {
        return await this.hasMany<UserData, User, ApiTokenData, ApiToken>(this, this.primaryKey, ApiToken, 'userId');
    }

    setAttribute<K extends keyof UserData = keyof UserData>(key: K, value: any): void {
        super.setAttribute(key, value)

        if(key === 'hashedPassword') {
            this.data = this.observeDataCustom<UserObserver>('onPasswordChanged', this.data)
        }
    }
}