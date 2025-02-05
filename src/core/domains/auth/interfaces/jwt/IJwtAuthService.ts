/* eslint-disable no-unused-vars */
import { IRouter } from "@src/core/domains/http/interfaces/IRouter";

import { IApiTokenModel } from "../models/IApiTokenModel";
import { IUserRepository } from "../repository/IUserRepository";


export interface IJwtAuthService {
    attemptCredentials(email: string, password: string, scopes?: string[]): Promise<string>
    attemptAuthenticateToken(token: string): Promise<IApiTokenModel | null>
    revokeToken(apiToken: IApiTokenModel): Promise<void>
    revokeAllTokens(userId: string | number): Promise<void>
    getRouter(): IRouter
    getUserRepository(): IUserRepository
}
