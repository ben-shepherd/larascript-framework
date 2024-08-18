import IData from "@src/core/interfaces/IData";
import { IModel } from "@src/core/interfaces/IModel";
import { ObjectId } from "mongodb";

export interface IApiTokenData extends IData {
    userId: ObjectId
    token: string
    revokedAt: Date | null;
}

export default interface IApiTokenModel extends IModel<IApiTokenData> {
    user(): Promise<any>;
}