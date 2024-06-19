import { ModelConstructor } from "@src/core/interfaces/IModel";
import { ServiceConstructor } from "@src/core/interfaces/IService";
import IApiTokenModel from "./IApitokenModel";
import { IAuthService } from "./IAuthService";
import IUserModel from "./IUserModel";

export interface IAuthConfig {
    authService: ServiceConstructor<IAuthService>;
    userModel: ModelConstructor<IUserModel>;
    userRepository: any;
    apiTokenModel: ModelConstructor<IApiTokenModel>,
    apiTokenRepository: any;
    authRoutes: boolean;
    authCreateAllowed: boolean;
}