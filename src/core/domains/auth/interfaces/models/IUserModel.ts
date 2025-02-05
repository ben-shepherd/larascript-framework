/* eslint-disable no-unused-vars */
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";

export interface UserConstructor<TUser extends IUserModel = IUserModel> extends ModelConstructor<TUser> {}

export interface IUserModel extends IModel {
    getEmail(): string | null;
    setEmail(email: string): Promise<void>;
    getHashedPassword(): string | null;
    setHashedPassword(hashedPassword: string): Promise<void>;
    getRoles(): string[];
    setRoles(roles: string[]): Promise<void>;
    getGroups(): string[];
    setGroups(groups: string[]): Promise<void>;
}
