import { ObjectId } from 'mongodb';

import { BaseUserData } from '../../core/domains/auth/types/types.t';

export interface UserData extends BaseUserData {
    _id?: ObjectId | undefined
    email: string
    hashedPassword: string
    roles: string[]
}