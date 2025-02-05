/* eslint-disable no-unused-vars */
import IApiTokenModel from "@src/core/domains/auth-legacy/interfaces/IApitokenModel";
import IUserModel from "@src/core/domains/auth-legacy/interfaces/IUserModel";

export interface IApiTokenFactory
{
    createFromUser(user: IUserModel, scopes: string[]): IApiTokenModel
}