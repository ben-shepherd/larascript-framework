import ApiToken from "../../app/models/auth/ApiToken"
import User from "../../app/models/auth/User"
import ApiTokenRepository from "../../app/repositories/ApiTokenRepository"
import UserRepository from "../../app/repositories/UserRepository"

export interface IAuth {
    userRepository: UserRepository,
    apiTokenRepository: ApiTokenRepository,
    attemptAuthenticateToken: (token: string) => Promise<ApiToken | null>
    createToken: (user: User) => Promise<string>
    revokeToken: (apiToken: ApiToken) => Promise<void>
    attemptCredentials: (email: string, password: string) => Promise<string>
}

