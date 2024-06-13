import { BaseApiTokenData } from '@src/core/domains/auth/types/types.t';
import { ObjectId } from 'mongodb';

export interface ApiTokenData extends BaseApiTokenData {
    _id?: ObjectId
    userId: ObjectId
    token: string
    revokedAt: Date | null;
}