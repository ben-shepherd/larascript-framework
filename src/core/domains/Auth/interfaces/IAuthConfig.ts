import IUserModel from "@src/core/domains/Auth/interfaces/IUserModel";
import { ModelConstructor } from "@src/core/interfaces/IModel";
import { ServiceConstructor } from "@src/core/interfaces/IService";

export interface IAuthConfig {
    authService: ServiceConstructor<any>;
    userModel: ModelConstructor<IUserModel>;
    userRepository: any;
    authRoutes: boolean;
    authCreateAllowed: boolean;
}