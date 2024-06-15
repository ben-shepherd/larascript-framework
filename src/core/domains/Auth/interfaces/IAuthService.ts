import IService from "@src/core/interfaces/IService";


export interface IAuthService extends IService {
    config: any;
    userRepository: any,
    apiTokenRepository: any,
    attemptAuthenticateToken: (...args: any[]) => Promise<any>
    createJwtFromUser: (...args: any[]) => Promise<any>
    createApiTokenFromUser: (...args: any[]) => Promise<any>
    revokeToken: (...args: any[]) => Promise<any>
    attemptCredentials: (...args: any[]) => Promise<any>
    jwt: (...args: any[]) => any
}

