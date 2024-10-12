/* eslint-disable no-unused-vars */
import { IModel } from "@src/core/interfaces/IModel";
import IModelAttributes from "@src/core/interfaces/IModelData";

export interface IApiTokenData extends IModelAttributes {
    userId: string;
    token: string;
    scopes: string[];
    revokedAt: Date | null;
}

export default interface IApiTokenModel extends IModel<IApiTokenData> {
    user(): Promise<any>;
    hasScope(scopes: string | string[], exactMatch?: boolean): boolean;
}