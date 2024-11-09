/* eslint-disable no-unused-vars */
import { ICtor } from "@src/core/interfaces/ICtor";
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
    setUserModelCtor(userModelCtor: ICtor<IUserModel>): void;
    getUserModelCtor(): ICtor<IUserModel>;
    user(): Promise<IUserModel | null>;
    hasScope(scopes: string | string[], exactMatch?: boolean): boolean;
}