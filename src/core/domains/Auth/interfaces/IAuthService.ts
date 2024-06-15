import IService from "@src/core/interfaces/IService"


export interface IAuthService extends IService {
    userRepository: any,
    apiTokenRepository: any,
    attemptAuthenticateToken: (...args: any[]) => Promise<any>
    createToken: (...args: any[]) => Promise<any>
    revokeToken: (...args: any[]) => Promise<any>
    attemptCredentials: (...args: any[]) => Promise<any>
    jwt: (...args: any[]) => any
}

