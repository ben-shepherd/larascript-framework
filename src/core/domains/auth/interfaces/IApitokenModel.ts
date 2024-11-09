/* eslint-disable no-unused-vars */
import { IModel } from "@src/core/interfaces/IModel";
import IModelAttributes from "@src/core/interfaces/IModelData";

import IUserModel from "./IUserModel";

export interface IApiTokenData extends IModelAttributes {
    userId: string;
    token: string;
    scopes: string[];
    revokedAt: Date | null;
}

export default interface IApiTokenModel extends IModel<IApiTokenData> {
    user(): Promise<IUserModel | null>;
    hasScope(scopes: string | string[], exactMatch?: boolean): boolean;
}