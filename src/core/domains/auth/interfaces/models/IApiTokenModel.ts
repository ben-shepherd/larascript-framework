/* eslint-disable no-unused-vars */
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import { IModel, ModelConstructor } from "@src/core/domains/models/interfaces/IModel";

export interface ApiTokenConstructor<TApiToken extends IApiTokenModel = IApiTokenModel> extends ModelConstructor<TApiToken> {}

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