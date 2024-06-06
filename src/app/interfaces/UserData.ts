import { ObjectId } from 'mongodb';

import { BaseUserData } from '../../core/domains/Auth/types/types.t';

export interface UserData extends BaseUserData {
    _id: ObjectId | null,
    email: string
    hashedPassword: string
    roles: string[]
}