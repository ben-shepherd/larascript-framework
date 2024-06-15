import { ModelConstructor } from "@src/core/interfaces/IModel";
import { RepositoryConstructor } from "@src/core/interfaces/IRepository";
import { ServiceConstructor } from "@src/core/interfaces/IService";
import IApiTokenRepository from "./IApiTokenRepository";
import IApiTokenModel from "./IApitokenModel";
import { IAuthService } from "./IAuthService";
import IUserModel from "./IUserModel";
import IUserRepository from "./IUserRepository";

export interface IAuthConfig {
    authService: ServiceConstructor<IAuthService>;
    userModel: ModelConstructor<IUserModel>;
    userRepository: RepositoryConstructor<IUserModel, IUserRepository>;
    apiTokenModel: ModelConstructor<IApiTokenModel>,
    apiTokenRepository: RepositoryConstructor<IApiTokenModel, IApiTokenRepository>;
    authRoutes: boolean;
    authCreateAllowed: boolean;
}