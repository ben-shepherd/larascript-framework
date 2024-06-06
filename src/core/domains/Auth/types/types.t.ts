import { ObjectId} from 'mongodb'
import IData from '../../../interfaces/IData';

export interface BaseUserData extends IData {
    id?: ObjectId | null
    email: string
    hashedPassword: string
    roles: string[]
}

export type ApiToken = {
    userId: BaseUserData
    token: string
    revokedAt: Date | null;
}

export type JWTToken = {
    uid: string;
    token: string;
    iat?: number;
    exp?: number;
}