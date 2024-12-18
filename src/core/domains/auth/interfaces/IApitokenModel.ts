/* eslint-disable no-unused-vars */
import IUserModel from "@src/core/domains/auth/interfaces/IUserModel";
import BelongsTo from "@src/core/domains/eloquent/relational/BelongsTo";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import IModelAttributes from "@src/core/interfaces/IModelAttributes";

export interface ApiTokenAttributes extends IModelAttributes {
    userId: string;
    token: string;
    scopes: string[];
    revokedAt: Date | null;
    user: IUserModel | null;
}

export default interface IApiTokenModel extends IModel<ApiTokenAttributes> {
    setUserModelCtor(userModelCtor: ICtor<IUserModel>): void;
    getUserModelCtor(): ICtor<IUserModel>;
    user(): BelongsTo;
    hasScope(scopes: string | string[], exactMatch?: boolean): boolean;
}