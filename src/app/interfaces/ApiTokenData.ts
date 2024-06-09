import { ObjectId } from 'mongodb';
import { BaseApiTokenData } from '../../core/domains/auth/types/types.t';

export interface ApiTokenData extends BaseApiTokenData {
    _id?: ObjectId
    userId: ObjectId
    token: string
    revokedAt: Date | null;
}