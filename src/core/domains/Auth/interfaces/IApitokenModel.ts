import { IModel } from "@src/core/interfaces/IModel";

export default interface IApiTokenModel extends IModel {
    user(): Promise<any>;
}