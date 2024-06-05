import UserModel from '../models/UserModel'
import Roles from '../enums/RolesEnum'
import hashPassword from '../utils/hashPassword'

export default (email: string, password: string, roles: string[] = [Roles.USER]): UserModel => {
    return new UserModel({
        _id: null,
        email,
        hashedPassword: hashPassword(password),
        roles
    })
}