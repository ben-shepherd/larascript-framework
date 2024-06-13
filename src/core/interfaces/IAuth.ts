import ApiTokenRepository from "@src/app/repositories/auth/ApiTokenRepository"
import UserRepository from "@src/app/repositories/auth/UserRepository"


export interface IAuth {
    userRepository: UserRepository,
    apiTokenRepository: ApiTokenRepository,
    attemptAuthenticateToken: (...args: any[]) => Promise<any>
    createToken: (...args: any[]) => Promise<any>
    revokeToken: (...args: any[]) => Promise<any>
    attemptCredentials: (...args: any[]) => Promise<any>
    jwt: (...args: any[]) => any
}

