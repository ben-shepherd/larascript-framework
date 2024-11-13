/* eslint-disable no-unused-vars */
import IApiTokenModel from "@src/core/domains/auth/interfaces/IApitokenModel";
import IUserModel from "@src/core/domains/auth/interfaces/IUserModel";

export interface IApiTokenFactory
{
    createFromUser(user: IUserModel, scopes: string[]): IApiTokenModel
}