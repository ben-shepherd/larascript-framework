import { ObjectId} from 'mongodb'
import IData from '../../../interfaces/IData';

export interface BaseUserData extends IData {
    _id?: ObjectId
    email: string
    hashedPassword: string
    roles: string[]
}

export interface ApiTokenData extends IData {
    _id?: ObjectId
    userId: ObjectId
    token: string
    revokedAt: Date | null;
}

export interface JWTToken {
    uid: string;
    token: string;
    iat?: number;
    exp?: number;
}