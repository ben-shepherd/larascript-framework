import { ModelConstructor } from "@src/core/interfaces/IModel";
import { ServiceConstructor } from "@src/core/interfaces/IService";
import IUserModel from "./IUserModel";

export interface IAuthConfig {
    authService: ServiceConstructor<any>;
    userModel: ModelConstructor<IUserModel>;
    userRepository: any;
    authRoutes: boolean;
    authCreateAllowed: boolean;
}