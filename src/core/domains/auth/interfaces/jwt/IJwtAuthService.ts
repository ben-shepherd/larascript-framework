/* eslint-disable no-unused-vars */
import { IApiTokenModel } from "@src/core/domains/auth/interfaces/models/IApiTokenModel";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import { IUserRepository } from "@src/core/domains/auth/interfaces/repository/IUserRepository";
import { IRouter } from "@src/core/domains/http/interfaces/IRouter";


export interface IJwtAuthService {
    attemptCredentials(email: string, password: string, scopes?: string[]): Promise<string>
    attemptAuthenticateToken(token: string): Promise<IApiTokenModel | null>
    refreshToken(apiToken: IApiTokenModel): string;
    revokeToken(apiToken: IApiTokenModel): Promise<void>
    revokeAllTokens(userId: string | number): Promise<void>
    getRouter(): IRouter
    getUserRepository(): IUserRepository
    createJwtFromUser(user: IUserModel): Promise<string>
    getCreateUserTableSchema(): Record<string, unknown>
    getCreateApiTokenTableSchema(): Record<string, unknown>
}
