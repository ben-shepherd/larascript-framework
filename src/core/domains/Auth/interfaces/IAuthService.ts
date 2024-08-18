import IService from "@src/core/interfaces/IService";
import IApiTokenRepository from "./IApiTokenRepository";
import IUserRepository from "./IUserRepository";


export interface IAuthService<IUserModel, IApiTokenModel> extends IService {
    config: any;
    userRepository: IUserRepository;
    apiTokenRepository: IApiTokenRepository;
    attemptAuthenticateToken: (token: string) => Promise<IApiTokenModel | null>
    createJwtFromUser: (user: IUserModel) => Promise<string>
    createApiTokenFromUser: (user: IUserModel) => Promise<IApiTokenModel>
    revokeToken: (apiToken: IApiTokenModel) => Promise<void>
    attemptCredentials: (email: string, password: string) => Promise<string>
    jwt: (apiToken: IApiTokenModel) => string
}

