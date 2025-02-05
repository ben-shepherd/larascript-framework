/* eslint-disable no-unused-vars */
import { IApiTokenModel } from "../models/IApiTokenModel";

export interface IApiTokenRepository {
    findOneActiveToken(token: string): Promise<IApiTokenModel | null>
    revokeToken(apiToken: IApiTokenModel): Promise<void>
    revokeAllTokens(userId: string | number): Promise<void>
}