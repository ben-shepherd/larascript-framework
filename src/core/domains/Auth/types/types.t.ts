import { ObjectId} from 'mongodb'
import IData from '../../../interfaces/IData';

export interface BaseUserData extends IData {
    _id?: ObjectId | undefined
    email: string
    hashedPassword: string
    roles: string[]
}

export interface ApiToken extends IData {
    _id?: ObjectId | undefined
    userId: BaseUserData
    token: string
    revokedAt: Date | null;
}

export interface JWTToken {
    uid: string;
    token: string;
    iat?: number;
    exp?: number;
}