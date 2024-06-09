import Roles from '../enums/RolesEnum'
import BaseUserModel from '../models/BaseUserModel'
import hashPassword from '../utils/hashPassword'

export default <U extends BaseUserModel = BaseUserModel>(email: string, password: string, roles: string[] = [Roles.USER]): U => {
    return new BaseUserModel({
        email,
        hashedPassword: hashPassword(password),
        roles
    }) as U
}