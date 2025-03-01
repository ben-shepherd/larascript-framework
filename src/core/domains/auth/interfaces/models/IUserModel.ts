/* eslint-disable no-unused-vars */
import { IModel, ModelConstructor } from "@src/core/domains/models/interfaces/IModel";

export interface UserConstructor<TUser extends IUserModel = IUserModel> extends ModelConstructor<TUser> {}

export interface IUserModel extends IModel {
    getEmail(): string | null;
    setEmail(email: string): Promise<void>;
    getHashedPassword(): string | null;
    setHashedPassword(hashedPassword: string): Promise<void>;
    getRoles(): string[];
    setRoles(roles: string[]): Promise<void>;
    hasRole(role: string | string[]): boolean;
    getGroups(): string[];
    setGroups(groups: string[]): Promise<void>;
    hasScope(scope: string): boolean;
    hasScopes(scopes: string[]): boolean;
}
