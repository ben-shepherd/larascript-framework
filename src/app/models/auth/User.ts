import UserObserver from '@src/app/observers/UserObserver';

import { UserData } from '@src/app/interfaces/auth/UserData';
import BaseUserModel from '@src/core/domains/auth/models/BaseUserModel';

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


    /**
     * todo: delete, only example for custom observers
     */
    setAttribute<K extends keyof UserData = keyof UserData>(key: K, value: any): void {
        super.setAttribute(key, value)

        if(key === 'hashedPassword') {
            this.data = this.observeDataCustom<UserObserver>('onPasswordChanged', this.data)
        }
    }
}