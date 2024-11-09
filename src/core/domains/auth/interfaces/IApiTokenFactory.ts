/* eslint-disable no-unused-vars */
import IApiTokenModel from "./IApitokenModel";
import IUserModel from "./IUserModel";

export interface IApiTokenFactory
{
    createFromUser(user: IUserModel, scopes: string[]): IApiTokenModel
}