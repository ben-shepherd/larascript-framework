import BaseUserModel from '../models/BaseUserModel'
import Roles from '../enums/RolesEnum'
import hashPassword from '../utils/hashPassword'

export default (email: string, password: string, roles: string[] = [Roles.USER]): BaseUserModel => {
    return new BaseUserModel({
        email,
        hashedPassword: hashPassword(password),
        roles
    })
}