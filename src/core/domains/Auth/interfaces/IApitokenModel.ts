import { IModel } from "@src/core/interfaces/IModel";
import IModelData from "@src/core/interfaces/IModelData";
import { ObjectId } from "mongodb";

export interface IApiTokenData extends IModelData {
    userId: ObjectId
    token: string
    revokedAt: Date | null;
}

export default interface IApiTokenModel extends IModel<IApiTokenData> {
    user(): Promise<any>;
}