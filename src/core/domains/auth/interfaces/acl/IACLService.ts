/* eslint-disable no-unused-vars */
import { IUserModel } from "../models/IUserModel"
import { IAclConfig, IAclGroup, IAclRole } from "./IAclConfig"

export interface IACLService {
    getConfig(): IAclConfig
    getGroup(group: string | IAclGroup): IAclGroup
    getGroupRoles(group: string | IAclGroup): IAclRole[]
    getGroupScopes(group: string | IAclGroup): string[]
    getRoleScopesFromUser(user: IUserModel): string[]
    getRoleScopes(role: string | string[]): string[]
    getRole(role: string): IAclRole

}



