import IData from "@src/core/interfaces/IData";
import { IModel } from "@src/core/interfaces/IModel";

export interface IUserData extends IData {
    email: string
    hashedPassword: string
    roles: string[],
    firstName?: string;
    lastName?: string;
    createdAt?: Date,
    updatedAt?: Date,
}

export default interface IUserModel extends IModel<IUserData> {
    tokens(...args: any[]): Promise<any>;
}