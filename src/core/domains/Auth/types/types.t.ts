import IData from '@src/core/interfaces/IData';
import { ObjectId } from 'mongodb';

export interface BaseUserData extends IData {
    _id?: ObjectId
    email: string
    hashedPassword: string
    roles: string[]
}

export interface BaseApiTokenData extends IData {
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