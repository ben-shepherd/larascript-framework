import { ObjectId } from 'mongodb';

import { BaseUserData } from '@src/core/domains/auth/types/types.t';

export interface UserData extends BaseUserData {
    _id?: ObjectId
    email: string
    hashedPassword: string
    roles: string[]
}