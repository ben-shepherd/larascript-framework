/* eslint-disable no-unused-vars */
import { IApiTokenModel } from "@src/core/domains/auth/interfaces/models/IApiTokenModel";

export interface IApiTokenRepository {
    findOneActiveToken(token: string): Promise<IApiTokenModel | null>
    revokeToken(apiToken: IApiTokenModel): Promise<void>
    revokeAllTokens(userId: string | number): Promise<void>
}