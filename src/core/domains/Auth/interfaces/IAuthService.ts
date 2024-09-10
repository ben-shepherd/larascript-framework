import IApiTokenModel from "@src/core/domains/auth/interfaces/IApitokenModel";
import IApiTokenRepository from "@src/core/domains/auth/interfaces/IApiTokenRepository";
import IUserModel from "@src/core/domains/auth/interfaces/IUserModel";
import IUserRepository from "@src/core/domains/auth/interfaces/IUserRepository";
import IService from "@src/core/interfaces/IService";
import { IRoute } from "@src/core/domains/express/interfaces/IRoute";


export interface IAuthService extends IService {
    config: any;
    userRepository: IUserRepository;
    apiTokenRepository: IApiTokenRepository;
    attemptAuthenticateToken: (token: string) => Promise<IApiTokenModel | null>
    createJwtFromUser: (user: IUserModel) => Promise<string>
    createApiTokenFromUser: (user: IUserModel) => Promise<IApiTokenModel>
    revokeToken: (apiToken: IApiTokenModel) => Promise<void>
    attemptCredentials: (email: string, password: string) => Promise<string>
    jwt: (apiToken: IApiTokenModel) => string
    getAuthRoutes(): IRoute[] | null
}

