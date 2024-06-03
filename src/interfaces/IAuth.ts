import ApiTokenModel from "../domains/Auth/models/ApiTokenModel"
import UserModel from "../domains/Auth/models/UserModel"

export interface IAuth {
    authenticateToken: (token: string) => Promise<ApiTokenModel | null>
    createToken: (user: UserModel) => Promise<string>
    revokeToken: (apiToken: ApiTokenModel) => Promise<void>
    login: (email: string, password: string) => Promise<string>
}

