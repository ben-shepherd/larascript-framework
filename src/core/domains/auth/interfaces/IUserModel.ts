/* eslint-disable no-unused-vars */
import { IUserData } from "@src/app/models/auth/User";
import { IModel } from "@src/core/interfaces/IModel";

export default interface IUserModel extends IModel<IUserData> {
    tokens(...args: any[]): Promise<any>;
    hasRole(...args: any[]): any;
    hasGroup(...args: any[]): any;
}