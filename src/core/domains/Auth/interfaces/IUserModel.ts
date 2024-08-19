import { IModel } from "@src/core/interfaces/IModel";
import IModelData from "@src/core/interfaces/IModelData";

export interface IUserData extends IModelData {
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