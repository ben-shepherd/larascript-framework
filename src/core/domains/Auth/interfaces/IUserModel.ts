import { IModel } from "@src/core/interfaces/IModel";

export default interface IUserModel extends IModel {
    tokens(...args: any[]): Promise<any>;
}