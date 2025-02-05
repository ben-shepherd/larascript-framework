/* eslint-disable no-unused-vars */
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";

export interface ApiTokenConstructor<TApiToken extends IApiTokenModel = IApiTokenModel> extends ModelConstructor<TApiToken> {
    new (data: TApiToken['attributes'] | null): TApiToken
}

export interface IApiTokenModel extends IModel {
    getUserId(): string
    setUserId(userId: string): Promise<void>
    getToken(): string
    setToken(token: string): Promise<void>
    getScopes(): string[]
    setScopes(scopes: string[]): Promise<void>
    getRevokedAt(): Date | null
    setRevokedAt(revokedAt: Date | null): Promise<void>

}