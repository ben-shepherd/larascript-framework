/* eslint-disable no-unused-vars */
import { IAclConfig, IAclGroup, IAclRole } from "@src/core/domains/auth/interfaces/acl/IAclConfig"
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel"

export interface IACLService {
    getConfig(): IAclConfig
    getDefaultGroup(): IAclGroup
    getGroup(group: string | IAclGroup): IAclGroup
    getGroupRoles(group: string | IAclGroup): IAclRole[]
    getGroupScopes(group: string | IAclGroup): string[]
    getRoleScopesFromUser(user: IUserModel): string[]
    getRoleScopes(role: string | string[]): string[]
    getRole(role: string): IAclRole
}



