import { ObjectId} from 'mongodb'

export type User = {
    _id: ObjectId | null,
    email: string
    hashedPassword: string
    roles: string[]
}

export type ApiToken = {
    userId: User
    token: string
    revokedAt: Date | null;
}

export type JWTToken = {
    uid: string;
    token: string;
    iat?: number;
    exp?: number;
}