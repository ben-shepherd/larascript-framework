/* eslint-disable no-unused-vars */
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";

export interface ApiTokenConstructor<TApiToken extends IApiTokenModel = IApiTokenModel> extends ModelConstructor<TApiToken> {
    new (data: TApiToken['attributes'] | null): TApiToken
}

export interface IApiTokenModel extends IModel {
    getUserId(): string
    setUserId(userId: string): Promise<void>
    getUser(): Promise<IUserModel>
    getToken(): string
    setToken(token: string): Promise<void>
    getScopes(): string[]
    setScopes(scopes: string[]): Promise<void>
    hasScope(scopes: string | string[], exactMatch?: boolean): boolean
    getRevokedAt(): Date | null
    setRevokedAt(revokedAt: Date | null): Promise<void>


}