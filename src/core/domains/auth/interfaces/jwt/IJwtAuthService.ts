/* eslint-disable no-unused-vars */
import { IApiTokenModel } from "@src/core/domains/auth/interfaces/models/IApiTokenModel";
import { IUserRepository } from "@src/core/domains/auth/interfaces/repository/IUserRepository";
import { IRouter } from "@src/core/domains/http/interfaces/IRouter";

import { IUserModel } from "../models/IUserModel";


export interface IJwtAuthService {
    attemptCredentials(email: string, password: string, scopes?: string[]): Promise<string>
    attemptAuthenticateToken(token: string): Promise<IApiTokenModel | null>
    refreshToken(apiToken: IApiTokenModel): string;
    revokeToken(apiToken: IApiTokenModel): Promise<void>
    revokeAllTokens(userId: string | number): Promise<void>
    getRouter(): IRouter
    getUserRepository(): IUserRepository
    createJwtFromUser(user: IUserModel): Promise<string>
}
